<?php

namespace App\Http\Controllers\Admin\Platform;

use App\Banking\LedgerException;
use App\Banking\LedgerService;
use App\Http\Requests\Admin\Platform\StoreAccountRequest;
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
            ->with('customer')
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
            ],
        ]);
    }

    public function create(Request $request, Tenant $tenant, GlobalSettings $settings): Response
    {
        $customers = $this->inBank($tenant, fn () => Customer::query()
            ->where('status', Customer::STATUS_ACTIVE)
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get()
            ->map(fn (Customer $customer) => [
                'value' => $customer->id,
                'label' => "{$customer->fullName()} ({$customer->accountNumber()})",
            ])
            ->all());

        return $this->render($tenant, 'accounts', 'Admin/Platform/Banks/Accounts/Create', [
            'customers' => $customers,
            'types' => $this->options(Account::TYPES),
            'currencies' => collect($settings->currencies())->map(fn (string $code) => ['value' => $code, 'label' => $code])->all(),
            'defaults' => [
                'customer_id' => $request->integer('customer') ?: '',
                'currency' => $settings->get('system.default_currency'),
            ],
        ]);
    }

    public function store(StoreAccountRequest $request, Tenant $tenant, LedgerService $ledger): RedirectResponse
    {
        $account = $this->inBank($tenant, function () use ($request, $ledger) {
            try {
                return DB::transaction(function () use ($request, $ledger) {
                    $account = Account::create($request->safe()->only(['customer_id', 'type', 'currency']));
                    $initial = $request->validated('initial_deposit');

                    if (filled($initial) && Money::toMinor($initial) > 0) {
                        $ledger->deposit($account, Money::toMinor($initial), 'Initial deposit', $request->user());
                    }

                    return $account;
                });
            } catch (LedgerException $exception) {
                throw ValidationException::withMessages(['initial_deposit' => $exception->getMessage()]);
            }
        });

        $account->load('customer');

        return redirect()
            ->route('admin.platform.banks.accounts.show', [$tenant, $account->id])
            ->with('success', ucfirst($account->type).' account opened for '.$account->customer->fullName().'.');
    }

    public function show(Request $request, Tenant $tenant, int $account, LedgerService $ledger): Response
    {
        $props = $this->inBank($tenant, function () use ($account) {
            $model = Account::query()->with('customer')->findOrFail($account);

            return [
                'account' => [
                    ...$this->presentAccount($model),
                    'opened_at' => $model->opened_at?->format('M j, Y'),
                    'closed_at' => $model->closed_at?->format('M j, Y'),
                ],
                'transactions' => $model->transactions()
                    ->with(['account.customer', 'relatedAccount', 'creator'])
                    ->latest('id')
                    ->paginate(20)
                    ->through(fn (Transaction $transaction) => $this->presentTransaction($transaction)),
                'transferTargets' => Account::query()
                    ->with('customer')
                    ->where('status', Account::STATUS_ACTIVE)
                    ->where('currency', $model->currency)
                    ->whereKeyNot($model->id)
                    ->orderBy('id')
                    ->get()
                    ->map(fn (Account $target) => [
                        'value' => $target->id,
                        'label' => "{$target->label()} — {$target->customer?->fullName()} ({$target->customer?->accountNumber()})",
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

            $model->load('customer');

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
            'label' => $account->label(),
            'type' => $account->type,
            'type_label' => Account::TYPES[$account->type] ?? $account->type,
            'currency' => $account->currency,
            'status' => $account->status,
            'balance' => $this->money($account->balance, $account->currency),
            'customer' => $account->customer ? [
                'id' => $account->customer->id,
                'name' => $account->customer->fullName(),
                'account_number' => $account->customer->accountNumber(),
            ] : null,
        ];
    }
}
