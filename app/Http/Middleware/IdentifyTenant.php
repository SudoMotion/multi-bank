<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use App\Tenancy\PathTenantBootstrap;
use App\Tenancy\TenantContext;
use App\Tenancy\TenantResolver;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IdentifyTenant
{
    public function __construct(
        private readonly TenantResolver $resolver,
        private readonly TenantContext $context,
        private readonly PathTenantBootstrap $pathBootstrap,
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();

        if ($this->resolver->isCentralHost($host)) {
            return $this->handleCentralHost($request, $next);
        }

        $tenant = $this->resolver->resolve($host);

        abort_if($tenant === null, 404);

        if ($this->resolver->isSubdomainOfBaseDomain($host, $tenant)) {
            $path = $request->path();

            return redirect()->to(
                $tenant->url($path === '' ? '/' : $path),
                301,
            );
        }

        if (! $tenant->is_active) {
            return response()->view('tenancy.unavailable', ['tenant' => $tenant], 503);
        }

        $this->context->set($tenant);

        return $next($request);
    }

    private function handleCentralHost(Request $request, Closure $next): Response
    {
        $this->context->set(null);

        $slug = $this->firstPathSegment($request);

        if ($slug === null || $slug === '' || $this->resolver->isReservedPathPrefix($slug)) {
            return $next($request);
        }

        $tenant = Tenant::query()->where('slug', $slug)->first();

        if ($tenant === null) {
            return $next($request);
        }

        if (! $tenant->is_active) {
            return response()->view('tenancy.unavailable', ['tenant' => $tenant], 503);
        }

        $this->context->set($tenant);
        $this->pathBootstrap->apply($request, $slug);

        return $next($request);
    }

    private function firstPathSegment(Request $request): ?string
    {
        $path = parse_url((string) $request->server->get('REQUEST_URI'), PHP_URL_PATH) ?? '/';
        $segments = array_values(array_filter(explode('/', trim($path, '/')), fn ($part) => $part !== ''));

        return $segments[0] ?? null;
    }
}
