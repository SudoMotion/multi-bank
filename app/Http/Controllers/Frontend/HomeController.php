<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Support\RbcHomeContent;
use App\Support\SiteData;
use App\Tenancy\TenantContext;
use App\Tenancy\ThemeRegistry;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(TenantContext $tenancy): Response
    {
        if ($tenancy->check()) {
            $tenant = $tenancy->get();
            $theme = app(ThemeRegistry::class)->resolve($tenant?->theme);

            $props = [
                'aboutUs' => SiteData::aboutUs(),
                'sliders' => [],
                'blogs' => [],
                'awards' => [],
            ];

            if ($theme === 'rbc') {
                $props = array_merge($props, RbcHomeContent::marketing());
            }

            return Inertia::render('Frontend/BankHome/Index', $props);
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
                'sign_in_url' => $tenant->setting('online_banking_url') ?: $tenant->url('login'),
            ])
            ->values()
            ->all();
    }
}
