<?php

namespace App\Http\Controllers\Admin\Platform;

use App\Models\Account;
use App\Models\Customer;
use App\Models\Tenant;
use App\Models\Transaction;
use App\Models\User;
use Inertia\Response;

class OverviewController extends BankWorkspaceController
{
    use PresentsTransactions;

    public function __invoke(Tenant $tenant): Response
    {
        $props = $this->inBank($tenant, function () {
            $since = now()->subDays(30);

            $flows = Transaction::query()
                ->where('created_at', '>=', $since)
                ->selectRaw('currency, sum(case when amount > 0 then amount else 0 end) as credits, sum(case when amount < 0 then -amount else 0 end) as debits, count(*) as total')
                ->groupBy('currency')
                ->get();

            return [
                'stats' => [
                    'customers' => Customer::query()->count(),
                    'active_customers' => Customer::query()->where('status', Customer::STATUS_ACTIVE)->count(),
                    'accounts' => Account::query()->where('status', '!=', Account::STATUS_CLOSED)->count(),
                    'frozen_accounts' => Account::query()->where('status', Account::STATUS_FROZEN)->count(),
                    'users' => User::query()->count(),
                    'transactions_30d' => (int) $flows->sum('total'),
                ],
                'balances' => Account::query()
                    ->selectRaw('currency, sum(balance) as total, count(*) as accounts')
                    ->groupBy('currency')
                    ->orderBy('currency')
                    ->get()
                    ->map(fn ($row) => [
                        'currency' => $row->currency,
                        'accounts' => (int) $row->accounts,
                        'total' => $this->money((int) $row->total, $row->currency),
                    ])
                    ->all(),
                'flows' => $flows
                    ->map(fn ($row) => [
                        'currency' => $row->currency,
                        'credits' => $this->money((int) $row->credits, $row->currency),
                        'debits' => $this->money((int) $row->debits, $row->currency),
                    ])
                    ->all(),
                'recentTransactions' => Transaction::query()
                    ->with(['account.customers', 'relatedAccount'])
                    ->latest('id')
                    ->limit(8)
                    ->get()
                    ->map(fn (Transaction $transaction) => $this->presentTransaction($transaction))
                    ->all(),
            ];
        });

        return $this->render($tenant, 'overview', 'Admin/Platform/Banks/Overview', $props);
    }
}
