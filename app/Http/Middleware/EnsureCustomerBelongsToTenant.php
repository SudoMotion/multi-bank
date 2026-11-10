<?php

namespace App\Http\Middleware;

use App\Tenancy\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureCustomerBelongsToTenant
{
    public function __construct(private readonly TenantContext $context) {}

    public function handle(Request $request, Closure $next): Response
    {
        $customer = Auth::guard('customer')->user();

        if ($customer && $customer->tenant_id !== $this->context->id()) {
            Auth::guard('customer')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            abort(403);
        }

        return $next($request);
    }
}
