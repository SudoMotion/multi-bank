<?php

namespace App\Tenancy;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

/**
 * Applies path-based tenant routing: scoped session cookies, URL generation, and
 * an internal path strip so existing route definitions stay at the site root.
 */
class PathTenantBootstrap
{
    public function apply(Request $request, string $slug): void
    {
        config(['session.path' => '/'.$slug]);

        $root = rtrim((string) config('app.url'), '/').'/'.$slug;
        URL::forceRootUrl($root);

        $this->stripSlugPrefix($request, $slug);
    }

    private function stripSlugPrefix(Request $request, string $slug): void
    {
        $path = parse_url((string) $request->server->get('REQUEST_URI'), PHP_URL_PATH) ?? '/';
        $segments = array_values(array_filter(explode('/', trim($path, '/')), fn ($part) => $part !== ''));

        if (($segments[0] ?? null) !== $slug) {
            return;
        }

        array_shift($segments);
        $path = $segments === [] ? '/' : '/'.implode('/', $segments);
        $query = $request->getQueryString();
        $uri = $path.($query ? '?'.$query : '');

        $request->server->set('REQUEST_URI', $uri);
        $request->server->set('PATH_INFO', $path);

        $request->initialize(
            $request->query->all(),
            $request->request->all(),
            $request->attributes->all(),
            $request->cookies->all(),
            $request->files->all(),
            $request->server->all(),
            $request->getContent(),
        );
    }
}
