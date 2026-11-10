<?php

namespace App\Http\Controllers\Admin\Platform;

use App\Banking\LedgerException;
use App\Banking\LedgerService;
use App\Http\Requests\Admin\Platform\StoreTransactionRequest;
use App\Models\Account;
use App\Models\Tenant;
use App\Models\Transaction;
use App\Support\Money;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Response;

class TransactionController extends BankWorkspaceController
{
    use PresentsTransactions;

    public function index(Request $request, Tenant $tenant): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'type' => ['nullable', Rule::in(array_keys(Transaction::TYPES))],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date'],
        ]);

        $transactions = $this->inBank($tenant, fn () => Transaction::query()
            ->with(['account.customer', 'relatedAccount', 'creator'])
            ->when($filters['search'] ?? null, function (Builder $query, string $search) {
                $like = '%'.addcslashes($search, '%_\\').'%';

                $query->where(fn (Builder $query) => $query
                    ->where('reference', 'like', $like)
                    ->orWhere('description', 'like', $like)
                    ->orWhereHas('account', fn (Builder $account) => $account->search($search)));
            })
            ->when($filters['type'] ?? null, fn (Builder $query, string $type) => $query->where('type', $type))
            ->when($filters['from'] ?? null, fn (Builder $query, string $from) => $query->whereDate('created_at', '>=', $from))
            ->when($filters['to'] ?? null, fn (Builder $query, string $to) => $query->whereDate('created_at', '<=', $to))
            ->latest('id')
            ->paginate(25)
            ->withQueryString()
            ->through(fn (Transaction $transaction) => $this->presentTransaction($transaction)));

        return $this->render($tenant, 'transactions', 'Admin/Platform/Banks/Transactions/Index', [
            'transactions' => $transactions,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'type' => $filters['type'] ?? '',
                'from' => $filters['from'] ?? '',
                'to' => $filters['to'] ?? '',
            ],
            'types' => $this->options(Transaction::TYPES),
            'can' => [
                'create' => $request->user()->can('transactions.create'),
            ],
        ]);
    }

    public function create(Request $request, Tenant $tenant, LedgerService $ledger): Response
    {
        $accounts = $this->inBank($tenant, fn () => Account::query()
            ->with('customer')
            ->where('status', '!=', Account::STATUS_CLOSED)
            ->orderBy('id')
            ->get()
            ->map(fn (Account $account) => [
                'value' => $account->id,
                'label' => "{$account->label()} — {$account->customer?->fullName()} ({$account->customer?->accountNumber()})",
                'currency' => $account->currency,
                'status' => $account->status,
                'balance' => Money::format($account->balance, $account->currency),
            ])
            ->all());

        return $this->render($tenant, 'transactions', 'Admin/Platform/Banks/Transactions/Create', [
            'accounts' => $accounts,
            'operations' => $this->options(StoreTransactionRequest::OPERATIONS),
            'maxAmount' => Money::toDecimal($ledger->maxAmount()),
            'defaults' => [
                'operation' => $request->query('operation', 'deposit'),
                'account_id' => $request->integer('account') ?: '',
            ],
        ]);
    }

    public function store(StoreTransactionRequest $request, Tenant $tenant, LedgerService $ledger): RedirectResponse
    {
        $data = $request->validated();
        $amount = Money::toMinor($data['amount']);
        $description = $data['description'] ?? null;
        $actor = $request->user();

        $message = $this->inBank($tenant, function () use ($data, $amount, $description, $actor, $ledger) {
            $account = $this->findAccount($data['account_id'], 'account_id');

            try {
                $transaction = match ($data['operation']) {
                    'deposit' => $ledger->deposit($account, $amount, $description, $actor),
                    'withdrawal' => $ledger->withdraw($account, $amount, $description, $actor),
                    'transfer' => $ledger->transfer(
                        $account,
                        $this->findAccount($data['to_account_id'], 'to_account_id'),
                        $amount,
                        $description,
                        $actor,
                    )[0],
                    'adjustment' => $ledger->adjust(
                        $account,
                        $data['direction'] === 'debit' ? -$amount : $amount,
                        $description,
                        $actor,
                    ),
                };
            } catch (LedgerException $exception) {
                throw ValidationException::withMessages(['amount' => $exception->getMessage()]);
            }

            return StoreTransactionRequest::OPERATIONS[$data['operation']]
                .' of '.Money::format(abs($transaction->amount), $transaction->currency)
                ." posted (ref {$transaction->reference}).";
        });

        if ($request->boolean('stay')) {
            return back()->with('success', $message);
        }

        return redirect()
            ->route('admin.platform.banks.accounts.show', [$tenant, $data['account_id']])
            ->with('success', $message);
    }

    private function findAccount(int|string $id, string $field): Account
    {
        return Account::query()->find($id)
            ?? throw ValidationException::withMessages([$field => 'That account does not belong to this bank.']);
    }
}
