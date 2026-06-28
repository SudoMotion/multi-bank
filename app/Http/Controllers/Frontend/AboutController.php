<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Support\SiteData;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Frontend/About/Index', [
            'aboutUs' => SiteData::aboutUs(),
        ]);
    }
}
