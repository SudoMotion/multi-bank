<?php

namespace App\Http\Controllers\Admin\Platform;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Support\Money;
use App\Tenancy\TenantContext;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Base for the super admin "bank workspace": central-only pages that manage
 * one selected bank's data.
 *
 * All bank data must be read and written inside inBank(), which activates the
 * bank's tenant scope, and props must be plain arrays computed there. Banking
 * models are looked up by id inside inBank() (never via route-model binding,
 * which would resolve in the central scope).
 */
abstract class BankWorkspaceController extends Controller
{
    public const SESSION_KEY = 'platform.bank_id';

    public const SECTIONS = [
        'overview' => 'admin.platform.banks.overview',
        'customers' => 'admin.platform.banks.customers.index',
        'accounts' => 'admin.platform.banks.accounts.index',
        'transactions' => 'admin.platform.banks.transactions.index',
        'settings' => 'admin.platform.banks.settings.index',
    ];

    public function __construct(protected readonly TenantContext $tenancy) {}

    /**
     * @template TReturn
     *
     * @param  callable(): TReturn  $callback
     * @return TReturn
     */
    protected function inBank(Tenant $tenant, callable $callback): mixed
    {
        session()->put(self::SESSION_KEY, $tenant->id);

        return $this->tenancy->run($tenant, $callback);
    }

    /**
     * @param  array<string, mixed>  $props
     */
    protected function render(Tenant $tenant, string $section, string $component, array $props = []): Response
    {
        return Inertia::render($component, [
            ...$props,
            'workspace' => $this->workspace($tenant, $section),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    protected function workspace(Tenant $tenant, string $section): array
    {
        return [
            'section' => $section,
            'bank' => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'slug' => $tenant->slug,
                'host' => $tenant->primaryHost(),
                'url' => $tenant->url(),
                'logo_url' => $tenant->logoUrl(),
                'is_active' => $tenant->is_active,
                'primary_color' => $tenant->brandingWithDefaults()['primary_color'],
            ],
            'banks' => Tenant::query()
                ->orderBy('name')
                ->get(['id', 'name', 'slug', 'is_active'])
                ->map(fn (Tenant $bank) => [
                    'id' => $bank->id,
                    'name' => $bank->name,
                    'is_active' => $bank->is_active,
                ])
                ->all(),
        ];
    }

    /**
     * @return array{minor: int, decimal: string, formatted: string, currency: string}
     */
    protected function money(int $minor, string $currency): array
    {
        return [
            'minor' => $minor,
            'decimal' => Money::toDecimal($minor),
            'formatted' => Money::format($minor, $currency),
            'currency' => $currency,
        ];
    }

    /**
     * @param  array<string, string>  $labels
     * @return list<array{value: string, label: string}>
     */
    protected function options(array $labels): array
    {
        return collect($labels)
            ->map(fn (string $label, string $value) => ['value' => $value, 'label' => $label])
            ->values()
            ->all();
    }
}
