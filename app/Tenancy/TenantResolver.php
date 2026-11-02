<?php

namespace App\Tenancy;

use App\Models\Tenant;
use Illuminate\Support\Str;

class TenantResolver
{
    public function isCentralHost(string $host): bool
    {
        return in_array(Str::lower($host), $this->centralDomains(), true);
    }

    /**
     * Find the tenant for a host by subdomain of the base domain first, then
     * by custom domain. Returns null for unknown hosts.
     */
    public function resolve(string $host): ?Tenant
    {
        $host = Str::lower($host);
        $suffix = '.'.Str::lower((string) config('tenancy.base_domain'));

        if (Str::endsWith($host, $suffix)) {
            $slug = Str::beforeLast($host, $suffix);

            if ($slug !== '' && ! str_contains($slug, '.')) {
                return Tenant::query()->where('slug', $slug)->first();
            }

            return null;
        }

        return Tenant::query()->where('domain', $host)->first();
    }

    /**
     * @return list<string>
     */
    public function centralDomains(): array
    {
        return array_map(Str::lower(...), config('tenancy.central_domains', []));
    }
}
