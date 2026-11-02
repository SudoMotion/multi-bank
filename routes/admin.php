<?php

use App\Http\Controllers\Admin\AboutUsController;
use App\Http\Controllers\Admin\GlobalSettingsController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\Platform\AccountController;
use App\Http\Controllers\Admin\Platform\BankSettingsController;
use App\Http\Controllers\Admin\Platform\CustomerController;
use App\Http\Controllers\Admin\Platform\OverviewController;
use App\Http\Controllers\Admin\Platform\PlatformController;
use App\Http\Controllers\Admin\Platform\TransactionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\TenantController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('register', [RegisteredUserController::class, 'create'])
            ->name('register');

        Route::post('register', [RegisteredUserController::class, 'store']);

        Route::get('login', [AuthenticatedSessionController::class, 'create'])
            ->name('login');

        Route::post('login', [AuthenticatedSessionController::class, 'store']);

        Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
            ->name('password.request');

        Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
            ->name('password.email');

        Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
            ->name('password.reset');

        Route::post('reset-password', [NewPasswordController::class, 'store'])
            ->name('password.store');
    });

    Route::middleware('auth')->group(function () {
        Route::get('verify-email', EmailVerificationPromptController::class)
            ->name('verification.notice');

        Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
            ->middleware(['signed', 'throttle:6,1'])
            ->name('verification.verify');

        Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
            ->middleware('throttle:6,1')
            ->name('verification.send');

        Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
            ->name('password.confirm');

        Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

        Route::put('password', [PasswordController::class, 'update'])->name('password.update');

        Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
            ->name('logout');
    });

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::redirect('/', '/admin/dashboard')->name('index');

        Route::get('dashboard', function () {
            return Inertia::render('Admin/Dashboard/Index');
        })->middleware('permission:dashboard.view')->name('dashboard');

        Route::middleware('permission:users.view')->group(function () {
            Route::get('users', [UserController::class, 'index'])->name('users.index');
            Route::get('users/create', [UserController::class, 'create'])
                ->middleware('permission:users.create')
                ->name('users.create');
            Route::post('users', [UserController::class, 'store'])
                ->middleware('permission:users.create')
                ->name('users.store');
            Route::get('users/{user}/edit', [UserController::class, 'edit'])
                ->middleware('permission:users.edit')
                ->name('users.edit');
            Route::put('users/{user}', [UserController::class, 'update'])
                ->middleware('permission:users.edit')
                ->name('users.update');
            Route::delete('users/{user}', [UserController::class, 'destroy'])
                ->middleware('permission:users.delete')
                ->name('users.destroy');
        });

        Route::middleware(['central', 'permission:tenants.view'])->group(function () {
            Route::get('banks', [TenantController::class, 'index'])->name('tenants.index');
            Route::get('banks/create', [TenantController::class, 'create'])
                ->middleware('permission:tenants.create')
                ->name('tenants.create');
            Route::post('banks', [TenantController::class, 'store'])
                ->middleware('permission:tenants.create')
                ->name('tenants.store');
            Route::get('banks/{tenant}/edit', [TenantController::class, 'edit'])
                ->middleware('permission:tenants.edit')
                ->name('tenants.edit');
            Route::post('banks/{tenant}', [TenantController::class, 'update'])
                ->middleware('permission:tenants.edit')
                ->name('tenants.update');
            Route::patch('banks/{tenant}/status', [TenantController::class, 'toggleStatus'])
                ->middleware('permission:tenants.edit')
                ->name('tenants.status');
            Route::delete('banks/{tenant}', [TenantController::class, 'destroy'])
                ->middleware('permission:tenants.delete')
                ->name('tenants.destroy');
        });

        Route::middleware(['central', 'permission:global-settings.view'])->group(function () {
            Route::get('global-settings', [GlobalSettingsController::class, 'index'])->name('global-settings.index');
            Route::put('global-settings', [GlobalSettingsController::class, 'update'])
                ->middleware('permission:global-settings.update')
                ->name('global-settings.update');
        });

        Route::middleware(['central', 'permission:tenants.view'])
            ->prefix('platform')
            ->name('platform.')
            ->group(function () {
                Route::get('/', [PlatformController::class, 'index'])->name('index');

                foreach (['customers', 'accounts', 'transactions', 'settings'] as $section) {
                    Route::get($section, [PlatformController::class, 'go'])
                        ->defaults('section', $section)
                        ->name($section);
                }

                Route::prefix('banks/{tenant}')->name('banks.')->group(function () {
                    Route::get('/', OverviewController::class)->name('overview');

                    Route::middleware('permission:customers.view')->group(function () {
                        Route::get('customers', [CustomerController::class, 'index'])->name('customers.index');
                        Route::get('customers/create', [CustomerController::class, 'create'])
                            ->middleware('permission:customers.create')
                            ->name('customers.create');
                        Route::post('customers', [CustomerController::class, 'store'])
                            ->middleware('permission:customers.create')
                            ->name('customers.store');
                        Route::get('customers/{customer}', [CustomerController::class, 'show'])
                            ->whereNumber('customer')
                            ->name('customers.show');
                        Route::get('customers/{customer}/edit', [CustomerController::class, 'edit'])
                            ->whereNumber('customer')
                            ->middleware('permission:customers.edit')
                            ->name('customers.edit');
                        Route::put('customers/{customer}', [CustomerController::class, 'update'])
                            ->whereNumber('customer')
                            ->middleware('permission:customers.edit')
                            ->name('customers.update');
                        Route::delete('customers/{customer}', [CustomerController::class, 'destroy'])
                            ->whereNumber('customer')
                            ->middleware('permission:customers.delete')
                            ->name('customers.destroy');
                    });

                    Route::middleware('permission:accounts.view')->group(function () {
                        Route::get('accounts', [AccountController::class, 'index'])->name('accounts.index');
                        Route::get('accounts/create', [AccountController::class, 'create'])
                            ->middleware('permission:accounts.create')
                            ->name('accounts.create');
                        Route::post('accounts', [AccountController::class, 'store'])
                            ->middleware('permission:accounts.create')
                            ->name('accounts.store');
                        Route::get('accounts/{account}', [AccountController::class, 'show'])
                            ->whereNumber('account')
                            ->name('accounts.show');
                        Route::patch('accounts/{account}/status', [AccountController::class, 'updateStatus'])
                            ->whereNumber('account')
                            ->middleware('permission:accounts.edit')
                            ->name('accounts.status');
                    });

                    Route::middleware('permission:transactions.view')->group(function () {
                        Route::get('transactions', [TransactionController::class, 'index'])->name('transactions.index');
                        Route::get('transactions/create', [TransactionController::class, 'create'])
                            ->middleware('permission:transactions.create')
                            ->name('transactions.create');
                        Route::post('transactions', [TransactionController::class, 'store'])
                            ->middleware('permission:transactions.create')
                            ->name('transactions.store');
                    });

                    Route::middleware('permission:settings.view')->group(function () {
                        Route::get('settings', [BankSettingsController::class, 'index'])->name('settings.index');
                        Route::post('settings', [BankSettingsController::class, 'update'])
                            ->middleware('permission:settings.update')
                            ->name('settings.update');
                    });
                });
            });

        Route::middleware(['central', 'permission:roles.view'])->group(function () {
            Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
            Route::get('roles/create', [RoleController::class, 'create'])
                ->middleware('permission:roles.create')
                ->name('roles.create');
            Route::post('roles', [RoleController::class, 'store'])
                ->middleware('permission:roles.create')
                ->name('roles.store');
            Route::get('roles/{role}/edit', [RoleController::class, 'edit'])
                ->middleware('permission:roles.edit')
                ->name('roles.edit');
            Route::put('roles/{role}', [RoleController::class, 'update'])
                ->middleware('permission:roles.edit')
                ->name('roles.update');
            Route::delete('roles/{role}', [RoleController::class, 'destroy'])
                ->middleware('permission:roles.delete')
                ->name('roles.destroy');
        });

        Route::middleware(['central', 'permission:permissions.view'])->group(function () {
            Route::get('permissions', [PermissionController::class, 'index'])->name('permissions.index');
            Route::post('permissions', [PermissionController::class, 'update'])
                ->middleware('permission:permissions.update')
                ->name('permissions.update');
        });

        Route::middleware('permission:about-us.view')->group(function () {
            Route::get('about-us', [AboutUsController::class, 'index'])->name('about-us.index');
            Route::post('about-us', [AboutUsController::class, 'update'])
                ->middleware('permission:about-us.update')
                ->name('about-us.update');
        });

        Route::middleware('permission:settings.view')->group(function () {
            Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');
            Route::post('settings', [SettingsController::class, 'update'])
                ->middleware('permission:settings.update')
                ->name('settings.update');
        });
    });
});
