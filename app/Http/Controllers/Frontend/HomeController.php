<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Support\SiteData;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Frontend/Home/Index', [
            'aboutUs' => SiteData::aboutUs(),
        ]);
    }
}
