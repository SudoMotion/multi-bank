<?php

namespace App\Tenancy;

use App\Models\Tenant;

class TenantPathFormatter
{
    public function format(string $path): string
    {
        $path = '/'.ltrim($path, '/');

        foreach (config('tenancy.root_asset_prefixes', []) as $prefix) {
            if ($path === $prefix || str_starts_with($path, $prefix.'/')) {
                return $path;
            }
        }

        $tenant = app(TenantContext::class)->get();

        if (! $tenant instanceof Tenant || filled($tenant->domain)) {
            return $path;
        }

        $slugPrefix = '/'.$tenant->slug;

        if ($path === '/') {
            return $slugPrefix;
        }

        if ($path === $slugPrefix || str_starts_with($path, $slugPrefix.'/')) {
            return $path;
        }

        return $slugPrefix.$path;
    }
}
