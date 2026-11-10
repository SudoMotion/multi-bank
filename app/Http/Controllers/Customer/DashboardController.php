<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Transaction;
use App\Support\Money;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var Customer $customer */
        $customer = Auth::guard('customer')->user();

        $accounts = $customer->accounts()
            ->orderBy('type')
            ->orderBy('id')
            ->get()
            ->map(fn ($account) => [
                'id' => $account->id,
                'label' => $account->label(),
                'type' => $account->type,
                'status' => $account->status,
                'currency' => $account->currency,
                'balance' => Money::toDecimal($account->balance),
                'balance_formatted' => Money::format($account->balance, $account->currency),
            ]);

        $accountIds = $accounts->pluck('id');

        $transactions = Transaction::query()
            ->whereIn('account_id', $accountIds)
            ->with('account:id,type,customer_id')
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->limit(25)
            ->get()
            ->map(fn (Transaction $txn) => [
                'id' => $txn->id,
                'reference' => $txn->reference,
                'type' => $txn->type,
                'description' => $txn->description,
                'amount' => Money::toDecimal($txn->amount),
                'amount_formatted' => Money::format($txn->amount, $txn->currency),
                'balance_after_formatted' => Money::format($txn->balance_after, $txn->currency),
                'account_label' => $txn->account?->label(),
                'created_at' => $txn->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Customer/Dashboard/Index', [
            'customer' => [
                'name' => $customer->fullName(),
                'email' => $customer->email,
                'account_number' => $customer->accountNumber(),
            ],
            'accounts' => $accounts,
            'transactions' => $transactions,
        ]);
    }
}
