<?php

namespace App\Http\Middleware;

use App\Tenancy\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Customer online banking is only available on a bank (tenant) host.
 */
class EnsureTenantHost
{
    public function __construct(private readonly TenantContext $context) {}

    public function handle(Request $request, Closure $next): Response
    {
        abort_unless($this->context->check(), 404);

        return $next($request);
    }
}
