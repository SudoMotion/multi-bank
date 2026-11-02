<?php

namespace App\Http\Middleware;

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
        $user = $request->user();
        $tenant = app(TenantContext::class)->get();
        $permissions = $user ? $user->getAllPermissions()->pluck('name') : collect();

        if ($tenant) {
            $permissions = $permissions->diff(Permissions::centralOnly());
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'roles' => $user ? $user->getRoleNames()->values()->all() : [],
                'permissions' => $permissions->values()->all(),
                'isSuperAdmin' => $user?->isSuperAdmin() ?? false,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
            ],
            'site' => fn () => SiteData::settings(),
            'tenant' => $tenant?->toContext(),
            'tenancy' => [
                'isCentral' => $tenant === null,
            ],
        ];
    }
}
