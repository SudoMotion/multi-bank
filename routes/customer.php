<?php

use App\Http\Controllers\Customer\AccountController;
use App\Http\Controllers\Customer\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Customer\Auth\RegisteredCustomerController;
use App\Http\Controllers\Customer\DashboardController;
use App\Http\Controllers\Customer\ProfileController;
use App\Http\Controllers\Customer\TransactionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['tenant'])->group(function () {
    Route::middleware('guest:customer')->group(function () {
        Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('customer.login');
        Route::post('login', [AuthenticatedSessionController::class, 'store']);

        Route::get('register', [RegisteredCustomerController::class, 'create'])->name('customer.register');
        Route::post('register', [RegisteredCustomerController::class, 'store']);
    });

    Route::middleware('auth:customer')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('customer.dashboard');
        Route::get('accounts', [AccountController::class, 'index'])->name('customer.accounts');
        Route::get('transactions', [TransactionController::class, 'index'])->name('customer.transactions');
        Route::get('profile', [ProfileController::class, 'index'])->name('customer.profile');
        Route::patch('profile', [ProfileController::class, 'update'])->name('customer.profile.update');
        Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('customer.logout');
    });
});
