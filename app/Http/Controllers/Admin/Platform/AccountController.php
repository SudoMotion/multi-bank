<?php

namespace App\Http\Controllers\Admin\Platform;

use App\Banking\LedgerService;
use App\Http\Requests\Admin\Platform\StoreAccountRequest;
use App\Http\Requests\Admin\Platform\UpdateAccountRequest;
use App\Http\Requests\Admin\Platform\StoreTransactionRequest;
use App\Models\Account;
use App\Models\Customer;
use App\Models\Tenant;
use App\Models\Transaction;
use App\Support\GlobalSettings;
use App\Support\Money;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Response;

class AccountController extends BankWorkspaceController
{
    use PresentsTransactions;

    public function index(Request $request, Tenant $tenant): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::in(array_keys(Account::STATUSES))],
            'type' => ['nullable', Rule::in(array_keys(Account::TYPES))],
        ]);

        $accounts = $this->inBank($tenant, fn () => Account::query()
            ->with('customers')
            ->withCount('transactions')
            ->search($filters['search'] ?? null)
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->when($filters['type'] ?? null, fn ($query, string $type) => $query->where('type', $type))
            ->latest('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Account $account) => $this->presentAccount($account)));

        return $this->render($tenant, 'accounts', 'Admin/Platform/Banks/Accounts/Index', [
            'accounts' => $accounts,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'status' => $filters['status'] ?? '',
                'type' => $filters['type'] ?? '',
            ],
            'statuses' => $this->options(Account::STATUSES),
            'types' => $this->options(Account::TYPES),
            'can' => [
                'create' => $request->user()->can('accounts.create'),
                'edit' => $request->user()->can('accounts.edit'),
                'delete' => $request->user()->can('accounts.delete'),
            ],
        ]);
    }

    public function create(Tenant $tenant): Response
    {
        return $this->render($tenant, 'accounts', 'Admin/Platform/Banks/Accounts/Create', [
            'statuses' => $this->options(Account::STATUSES),
            'defaultStatus' => Account::STATUS_ACTIVE,
        ]);
    }

    public function store(StoreAccountRequest $request, Tenant $tenant, GlobalSettings $settings): RedirectResponse
    {
        $account = $this->inBank($tenant, fn () => Account::create([
            ...$request->accountAttributes(),
            'type' => 'checking',
            'currency' => $settings->get('system.default_currency'),
        ]));

        return redirect()
            ->route('admin.platform.banks.accounts.show', [$tenant, $account->id])
            ->with('success', "Account \"{$account->name}\" created.");
    }

    public function edit(Tenant $tenant, int $account): Response
    {
        $props = $this->inBank($tenant, fn () => [
            'account' => $this->presentAccount(Account::query()->findOrFail($account)),
        ]);

        return $this->render($tenant, 'accounts', 'Admin/Platform/Banks/Accounts/Edit', [
            ...$props,
            'statuses' => $this->options(Account::STATUSES),
        ]);
    }

    public function update(UpdateAccountRequest $request, Tenant $tenant, int $account): RedirectResponse
    {
        $message = $this->inBank($tenant, fn () => DB::transaction(function () use ($request, $account) {
            $model = Account::query()->lockForUpdate()->findOrFail($account);

            if ($model->isClosed()) {
                throw ValidationException::withMessages(['status' => 'Closed accounts cannot be edited.']);
            }

            $status = $request->validated('status');

            if ($status === Account::STATUS_CLOSED && $model->balance !== 0) {
                throw ValidationException::withMessages([
                    'status' => 'Only accounts with a zero balance can be closed.',
                ]);
            }

            $model->fill($request->accountAttributes());
            $model->closed_at = $status === Account::STATUS_CLOSED ? now() : null;
            $model->save();

            return "Account \"{$model->name}\" updated.";
        }));

        return redirect()
            ->route('admin.platform.banks.accounts.show', [$tenant, $account])
            ->with('success', $message);
    }

    public function destroy(Tenant $tenant, int $account): RedirectResponse
    {
        $result = $this->inBank($tenant, function () use ($account) {
            $model = Account::query()->withCount('transactions')->findOrFail($account);

            if ($model->balance !== 0) {
                return ['error' => 'Withdraw or transfer the balance to zero before deleting this account.'];
            }

            if ($model->transactions_count > 0) {
                return ['error' => 'Accounts with transaction history cannot be deleted.'];
            }

            $name = $model->label();
            $model->delete();

            return ['success' => "Account \"{$name}\" deleted."];
        });

        if (isset($result['error'])) {
            return back()->with('error', $result['error']);
        }

        return redirect()
            ->route('admin.platform.banks.accounts.index', $tenant)
            ->with('success', $result['success']);
    }

    public function show(Request $request, Tenant $tenant, int $account, LedgerService $ledger): Response
    {
        $props = $this->inBank($tenant, function () use ($account) {
            $model = Account::query()->with('customers')->findOrFail($account);

            return [
                'account' => [
                    ...$this->presentAccount($model),
                    'opened_at' => $model->opened_at?->format('M j, Y'),
                    'closed_at' => $model->closed_at?->format('M j, Y'),
                ],
                'transactions' => $model->transactions()
                    ->with(['account.customers', 'relatedAccount', 'creator'])
                    ->latest('id')
                    ->paginate(20)
                    ->through(fn (Transaction $transaction) => $this->presentTransaction($transaction)),
                'transferTargets' => Account::query()
                    ->with('customers')
                    ->where('status', Account::STATUS_ACTIVE)
                    ->where('currency', $model->currency)
                    ->whereKeyNot($model->id)
                    ->orderBy('id')
                    ->get()
                    ->map(fn (Account $target) => [
                        'value' => $target->id,
                        'label' => $this->accountOptionLabel($target),
                    ])
                    ->all(),
            ];
        });

        return $this->render($tenant, 'accounts', 'Admin/Platform/Banks/Accounts/Show', [
            ...$props,
            'statuses' => $this->options(Account::STATUSES),
            'operations' => $this->options(StoreTransactionRequest::OPERATIONS),
            'maxAmount' => Money::toDecimal($ledger->maxAmount()),
            'can' => [
                'edit' => $request->user()->can('accounts.edit'),
                'transact' => $request->user()->can('transactions.create'),
            ],
        ]);
    }

    public function updateStatus(Request $request, Tenant $tenant, int $account): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(array_keys(Account::STATUSES))],
        ]);

        $message = $this->inBank($tenant, fn () => DB::transaction(function () use ($account, $data) {
            $model = Account::query()->lockForUpdate()->findOrFail($account);

            if ($model->isClosed()) {
                throw ValidationException::withMessages(['status' => 'Closed accounts cannot be reopened.']);
            }

            if ($data['status'] === Account::STATUS_CLOSED && $model->balance !== 0) {
                throw ValidationException::withMessages(['status' => 'Only accounts with a zero balance can be closed. Withdraw or transfer the remaining funds first.']);
            }

            $model->status = $data['status'];
            $model->closed_at = $data['status'] === Account::STATUS_CLOSED ? now() : null;
            $model->save();

            $model->load('customers');

            return "{$model->label()} is now ".Account::STATUSES[$model->status].'.';
        }));

        return back()->with('success', $message);
    }

    /**
     * @return array<string, mixed>
     */
    private function presentAccount(Account $account): array
    {
        return [
            'id' => $account->id,
            'name' => $account->name,
            'label' => $account->label(),
            'type' => $account->type,
            'type_label' => Account::TYPES[$account->type] ?? $account->type,
            'currency' => $account->currency,
            'status' => $account->status,
            'balance' => $this->money($account->balance, $account->currency),
            'balance_minor' => $account->balance,
            'transactions_count' => $account->transactions_count ?? null,
            'customers' => $account->customers->map(fn (Customer $customer) => [
                'id' => $customer->id,
                'name' => $customer->fullName(),
                'account_number' => $customer->accountNumber(),
            ])->all(),
        ];
    }

    private function accountOptionLabel(Account $account): string
    {
        $holders = $account->customers->map(
            fn (Customer $customer) => "{$customer->fullName()} ({$customer->accountNumber()})",
        )->implode(', ');

        return "{$account->label()}".($holders !== '' ? " — {$holders}" : '');
    }
}
