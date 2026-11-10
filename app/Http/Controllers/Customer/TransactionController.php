<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Customer;
use App\Models\Transaction;
use App\Support\Money;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var Customer $customer */
        $customer = $request->user('customer');
        $accountId = $request->integer('account');

        $accountFilter = null;

        if ($accountId > 0) {
            $account = $customer->accounts()->whereKey($accountId)->first();

            if ($account === null) {
                abort(404);
            }

            $accountFilter = [
                'id' => $account->id,
                'name' => filled($account->name) ? $account->name : $account->label(),
            ];
        }

        $accountIds = $customer->accounts()->pluck('accounts.id');

        $query = Transaction::query()
            ->with('account:id,name,type')
            ->whereIn('account_id', $accountIds)
            ->orderByDesc('created_at')
            ->orderByDesc('id');

        if ($accountFilter !== null) {
            $query->where('account_id', $accountFilter['id']);
        }

        $transactions = $query
            ->get()
            ->map(fn (Transaction $transaction) => [
                'id' => $transaction->id,
                'account_id' => $transaction->account_id,
                'account_name' => filled($transaction->account?->name)
                    ? $transaction->account->name
                    : $transaction->account?->label(),
                'type' => $this->displayType($transaction->type),
                'amount' => Money::toDecimal(abs($transaction->amount)),
                'status' => $this->displayStatus($transaction->status ?? Transaction::STATUS_COMPLETE),
                'created_at' => $transaction->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Customer/Transactions/Index', [
            'transactions' => $transactions,
            'accountFilter' => $accountFilter,
        ]);
    }

    private function displayType(string $type): string
    {
        return match ($type) {
            Transaction::TYPE_WITHDRAWAL => 'withdraw',
            default => $type,
        };
    }

    private function displayStatus(string $status): string
    {
        return $status === Transaction::STATUS_COMPLETE ? 'completed' : $status;
    }
}
