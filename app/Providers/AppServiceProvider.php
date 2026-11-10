<?php

namespace App\Providers;

use App\Models\User;
use App\Support\GlobalSettings;
use App\Tenancy\TenantContext;
use App\Tenancy\TenantPathFormatter;
use App\Tenancy\ThemeRegistry;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->scoped(TenantContext::class);
        $this->app->scoped(GlobalSettings::class);
        $this->app->singleton(ThemeRegistry::class);
        $this->app->singleton(TenantPathFormatter::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        URL::formatPathUsing(function (string $path) {
            return app(TenantPathFormatter::class)->format($path);
        });

        Vite::createAssetPathsUsing(function (string $path, ?bool $secure = null) {
            return asset($path, $secure ?? request()->isSecure());
        });

        Gate::before(function (User $user, string $ability) {
            return $user->isSuperAdmin() ? true : null;
        });

        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return route('admin.password.reset', [
                'token' => $token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ]);
        });
    }
}
