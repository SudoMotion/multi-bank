<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Product/Index');
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Product/Create');
    }

    public function edit(string $product): Response
    {
        return Inertia::render('Admin/Product/Edit', [
            'productId' => $product,
        ]);
    }
}
