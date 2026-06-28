<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('admin')
    ->middleware(['auth', 'verified'])
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('dashboard');

        Route::get('/users', function () {
            return Inertia::render('Admin/Users/Index');
        })->name('users.index');
    });
