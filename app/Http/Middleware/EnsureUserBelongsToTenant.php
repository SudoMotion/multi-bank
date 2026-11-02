<?php

namespace App\Http\Middleware;

use App\Tenancy\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Defense in depth on top of the tenant global scope: an authenticated user
 * must belong to the tenant of the current host (or be a platform user on the
 * central domain). Guards against sessions shared across hosts, e.g. through a
 * wildcard SESSION_DOMAIN.
 */
class EnsureUserBelongsToTenant
{
    public function __construct(private readonly TenantContext $context) {}

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->tenant_id !== $this->context->id()) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            abort(403);
        }

        return $next($request);
    }
}
