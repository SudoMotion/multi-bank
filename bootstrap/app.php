<?php

use App\Http\Middleware\ConfigureSecureUrls;
use App\Http\Middleware\EnsureCentralContext;
use App\Http\Middleware\EnsureCustomerBelongsToTenant;
use App\Http\Middleware\EnsureTenantHost;
use App\Http\Middleware\EnsureUserBelongsToTenant;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\IdentifyTenant;
use App\Http\Middleware\TrustProxies;
use App\Tenancy\TenantContext;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('web')
                ->group(base_path('routes/admin.php'));

            Route::middleware('web')
                ->group(base_path('routes/customer.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->redirectGuestsTo(function (Request $request) {
            if ($request->is('admin', 'admin/*')) {
                return '/admin/login';
            }

            if (app(TenantContext::class)->check()) {
                return '/login';
            }

            return '/admin/login';
        });

        $middleware->redirectUsersTo(function (Request $request) {
            if ($request->is('admin', 'admin/*')) {
                return '/admin/dashboard';
            }

            return '/dashboard';
        });

        Authenticate::redirectUsing(function (Request $request) {
            if ($request->is('admin', 'admin/*')) {
                return route('admin.login');
            }

            if (app(TenantContext::class)->check()) {
                return route('customer.login');
            }

            return route('admin.login');
        });

        $middleware->prepend([
            TrustProxies::class,
            ConfigureSecureUrls::class,
            IdentifyTenant::class,
        ]);

        $middleware->web(append: [
            EnsureUserBelongsToTenant::class,
            EnsureCustomerBelongsToTenant::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'tenant' => EnsureTenantHost::class,
            'central' => EnsureCentralContext::class,
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );
    })->create();
