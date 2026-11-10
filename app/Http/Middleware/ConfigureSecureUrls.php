<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpFoundation\Response;

/**
 * When the app is served over HTTPS (including behind a TLS-terminating proxy),
 * generated asset and route URLs must use https to avoid mixed-content blocks.
 */
class ConfigureSecureUrls
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isSecure()) {
            URL::forceScheme('https');
            URL::useAssetOrigin('https://'.$request->getHttpHost());
        }

        return $next($request);
    }
}
