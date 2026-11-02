<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Support\SiteData;
use App\Tenancy\TenantContext;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(TenantContext $tenancy): Response
    {
        if ($tenancy->check()) {
            return Inertia::render('Frontend/BankHome/Index', [
                'aboutUs' => SiteData::aboutUs(),
            ]);
        }

        return Inertia::render('Frontend/Home/Index', [
            'banks' => $this->directory(),
        ]);
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function directory(): array
    {
        return Tenant::query()
            ->active()
            ->orderBy('name')
            ->get()
            ->filter(fn (Tenant $tenant) => (bool) $tenant->setting('show_in_directory', true))
            ->map(fn (Tenant $tenant) => [
                'name' => $tenant->name,
                'tagline' => $tenant->tagline,
                'logo' => $tenant->logoUrl(),
                'sign_in_url' => $tenant->url(),
            ])
            ->values()
            ->all();
    }
}
