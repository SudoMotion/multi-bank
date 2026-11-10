<?php

use App\Http\Controllers\Frontend\AboutController;
use App\Http\Controllers\Frontend\BlogController;
use App\Http\Controllers\Frontend\ContactController;
use App\Http\Controllers\Frontend\HomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [AboutController::class, 'index'])->name('about');
Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::get('/blogs', [BlogController::class, 'index'])->name('blogs.index');
Route::get('/blogs/{slug}', [BlogController::class, 'show'])->name('blogs.show');

use App\Tenancy\TenantContext;

Route::get('/login', function (TenantContext $tenancy) {
    return $tenancy->check()
        ? redirect()->route('customer.login')
        : redirect('/admin/login');
})->name('login');

Route::get('/dashboard', function (TenantContext $tenancy) {
    return $tenancy->check()
        ? redirect()->route('customer.dashboard')
        : redirect('/admin/dashboard');
})->name('dashboard');
