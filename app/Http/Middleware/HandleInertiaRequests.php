<?php

namespace App\Http\Middleware;

use App\Support\Money;
use App\Models\Customer;
use App\Models\User;
use App\Support\GlobalSettings;
use App\Support\Permissions;
use App\Support\SiteData;
use App\Tenancy\TenantContext;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user('web');
        $user = $user instanceof User ? $user : null;
        $customer = $request->user('customer');
        $customer = $customer instanceof Customer ? $customer : null;
        $tenant = app(TenantContext::class)->get();
        $permissions = $user ? $user->getAllPermissions()->pluck('name') : collect();

        if ($tenant) {
            $permissions = $permissions->diff(Permissions::centralOnly());
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'customer' => $customer ? [
                    'id' => $customer->id,
                    'name' => $customer->fullName(),
                    'first_name' => $customer->first_name,
                    'last_name' => $customer->last_name,
                    'email' => $customer->email,
                    'account_number' => $customer->accountNumber(),
                ] : null,
                'roles' => $user?->getRoleNames()->values()->all() ?? [],
                'permissions' => $permissions->values()->all(),
                'isSuperAdmin' => $user?->isSuperAdmin() ?? false,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'site' => fn () => SiteData::settings(),
            'tenant' => $tenant?->toContext(),
            'landing' => fn () => $tenant ? null : app(GlobalSettings::class)->group('landing'),
            'tenancy' => [
                'isCentral' => $tenant === null,
            ],
            'customerSummary' => fn () => self::customerSummary($customer),
        ];
    }

    /**
     * @return array{name: string, total_balance: string}|null
     */
    private static function customerSummary(?Customer $customer): ?array
    {
        if (! $customer) {
            return null;
        }

        $total = $customer->accounts()->get()->sum(
            fn ($account) => (float) Money::toDecimal($account->balance)
        );

        return [
            'name' => $customer->fullName(),
            'total_balance' => number_format($total, 2, '.', ''),
        ];
    }
}
