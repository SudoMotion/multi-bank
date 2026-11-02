<?php

namespace App\Http\Middleware;

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
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();

        if ($this->resolver->isCentralHost($host)) {
            $this->context->set(null);

            return $next($request);
        }

        $tenant = $this->resolver->resolve($host);

        abort_if($tenant === null, 404);

        if (! $tenant->is_active) {
            return response()->view('tenancy.unavailable', ['tenant' => $tenant], 503);
        }

        $this->context->set($tenant);

        return $next($request);
    }
}
