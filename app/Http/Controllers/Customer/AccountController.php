<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Customer;
use App\Support\Money;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var Customer $customer */
        $customer = $request->user('customer');

        $accounts = $customer->accounts()
            ->orderBy('name')
            ->orderBy('id')
            ->get()
            ->map(fn (Account $account) => [
                'id' => $account->id,
                'name' => filled($account->name) ? $account->name : $account->label(),
                'account_type' => Account::TYPES[$account->type] ?? ucfirst($account->type),
                'masked_number' => '••'.substr($customer->accountNumber(), -4),
                'currency' => $account->currency,
                'status' => $account->status === Account::STATUS_ACTIVE ? 'active' : 'inactive',
                'balance' => Money::toDecimal($account->balance),
            ])
            ->values()
            ->all();

        $totalsByCurrency = [];

        foreach ($accounts as $account) {
            $currency = $account['currency'] ?: 'CAD';
            $totalsByCurrency[$currency] = ($totalsByCurrency[$currency] ?? 0) + (float) $account['balance'];
        }

        $currencyTotals = collect($totalsByCurrency)
            ->map(fn (float $amount, string $currency) => [
                'currency' => $currency,
                'amount' => number_format($amount, 2, '.', ''),
            ])
            ->sortBy(fn (array $row) => $row['currency'] === 'CAD' ? 0 : 1)
            ->values()
            ->all();

        return Inertia::render('Customer/Accounts/Index', [
            'accounts' => $accounts,
            'currencyTotals' => $currencyTotals,
        ]);
    }
}
