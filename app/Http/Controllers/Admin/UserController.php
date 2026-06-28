<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Users/Index');
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function edit(string $user): Response
    {
        return Inertia::render('Admin/Users/Edit', [
            'userId' => $user,
        ]);
    }
}
