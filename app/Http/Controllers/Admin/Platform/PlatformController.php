<?php

namespace App\Http\Controllers\Admin\Platform;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Customer;
use App\Models\Tenant;
use App\Models\Transaction;
use App\Support\Money;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Super admin landing: every bank with headline numbers, plus shortcuts that
 * jump into the last selected bank's workspace.
 */
class PlatformController extends Controller
{
    public function index(): Response
    {
        $customers = Customer::acrossTenants()
            ->selectRaw('tenant_id, count(*) as total')
            ->groupBy('tenant_id')
            ->pluck('total', 'tenant_id');

        $accounts = Account::acrossTenants()
            ->where('status', '!=', Account::STATUS_CLOSED)
            ->selectRaw('tenant_id, count(*) as total')
            ->groupBy('tenant_id')
            ->pluck('total', 'tenant_id');

        $balances = Account::acrossTenants()
            ->selectRaw('tenant_id, currency, sum(balance) as total')
            ->groupBy('tenant_id', 'currency')
            ->get();

        $recentVolume = Transaction::acrossTenants()
            ->where('created_at', '>=', now()->subDays(30))
            ->whereIn('type', [Transaction::TYPE_DEPOSIT, Transaction::TYPE_WITHDRAWAL, Transaction::TYPE_TRANSFER_OUT])
            ->selectRaw('tenant_id, count(*) as total')
            ->groupBy('tenant_id')
            ->pluck('total', 'tenant_id');

        $banks = Tenant::query()
            ->withCount('users')
            ->orderBy('name')
            ->get()
            ->map(fn (Tenant $tenant) => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'slug' => $tenant->slug,
                'host' => $tenant->primaryHost(),
                'url' => $tenant->url(),
                'logo_url' => $tenant->logoUrl(),
                'is_active' => $tenant->is_active,
                'users_count' => $tenant->users_count,
                'customers_count' => (int) ($customers[$tenant->id] ?? 0),
                'accounts_count' => (int) ($accounts[$tenant->id] ?? 0),
                'transactions_30d' => (int) ($recentVolume[$tenant->id] ?? 0),
                'balances' => $balances
                    ->where('tenant_id', $tenant->id)
                    ->map(fn ($row) => Money::format((int) $row->total, $row->currency))
                    ->values()
                    ->all(),
            ]);

        $platformBalances = $balances
            ->groupBy('currency')
            ->map(fn ($rows, string $currency) => Money::format((int) $rows->sum('total'), $currency))
            ->values()
            ->all();

        return Inertia::render('Admin/Platform/Index', [
            'banks' => $banks,
            'totals' => [
                'banks' => $banks->count(),
                'active_banks' => $banks->where('is_active', true)->count(),
                'customers' => (int) $customers->sum(),
                'accounts' => (int) $accounts->sum(),
                'balances' => $platformBalances,
            ],
            'selectedBankId' => session(BankWorkspaceController::SESSION_KEY),
        ]);
    }

    /**
     * Sidebar shortcut: open a workspace section for the last selected bank.
     */
    public function go(Request $request, string $section): RedirectResponse
    {
        $tenant = Tenant::query()->find($request->session()->get(BankWorkspaceController::SESSION_KEY))
            ?? Tenant::query()->orderBy('name')->first();

        if (! $tenant) {
            return redirect()
                ->route('admin.tenants.index')
                ->with('error', 'Create a bank first.');
        }

        return redirect()->route(BankWorkspaceController::SECTIONS[$section], $tenant);
    }
}
