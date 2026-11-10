<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Support\RbcHomeContent;
use App\Tenancy\TenantContext;
use App\Tenancy\ThemeRegistry;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class BlogController extends Controller
{
    public function index(TenantContext $tenancy): InertiaResponse
    {
        if (! $tenancy->check() || ! $this->usesRbcMarketing($tenancy)) {
            abort(404);
        }

        return Inertia::render('Frontend/Blogs/Index', [
            'blogs' => RbcHomeContent::blogs(),
        ]);
    }

    public function show(TenantContext $tenancy, string $slug): InertiaResponse
    {
        if (! $tenancy->check() || ! $this->usesRbcMarketing($tenancy)) {
            abort(404);
        }

        $blogs = RbcHomeContent::blogs();
        $blog = collect($blogs)->firstWhere('slug', $slug);

        abort_unless($blog, 404);

        $relatedBlogs = collect($blogs)
            ->where('slug', '!=', $slug)
            ->take(3)
            ->values()
            ->all();

        return Inertia::render('Frontend/Blogs/Show', [
            'blog' => $blog,
            'relatedBlogs' => $relatedBlogs,
        ]);
    }

    private function usesRbcMarketing(TenantContext $tenancy): bool
    {
        $theme = app(ThemeRegistry::class)->resolve($tenancy->get()?->theme);

        return $theme === 'rbc';
    }
}
