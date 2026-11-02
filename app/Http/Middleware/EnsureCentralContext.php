<?php

namespace App\Http\Middleware;

use App\Tenancy\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Restricts platform-only routes (bank management, roles, permissions) to the
 * central domain. Tenant hosts get a 404 so the routes are not discoverable.
 */
class EnsureCentralContext
{
    public function __construct(private readonly TenantContext $context) {}

    public function handle(Request $request, Closure $next): Response
    {
        abort_if($this->context->check(), 404);

        return $next($request);
    }
}
