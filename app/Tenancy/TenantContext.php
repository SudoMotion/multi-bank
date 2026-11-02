<?php

namespace App\Tenancy;

use App\Models\Tenant;

/**
 * Holds the tenant (bank) for the current request. A null tenant means the
 * request is running in the central platform context.
 */
class TenantContext
{
    private ?Tenant $tenant = null;

    public function set(?Tenant $tenant): void
    {
        $this->tenant = $tenant;
    }

    public function get(): ?Tenant
    {
        return $this->tenant;
    }

    public function id(): ?int
    {
        return $this->tenant?->getKey();
    }

    public function check(): bool
    {
        return $this->tenant !== null;
    }

    public function isCentral(): bool
    {
        return $this->tenant === null;
    }

    /**
     * Storage folder for uploads, namespaced per tenant so files never mix.
     */
    public function storagePath(string $folder): string
    {
        return $this->tenant?->storageDirectory($folder) ?? $folder;
    }

    /**
     * Run the callback as if the given tenant were active (null = central),
     * restoring the previous tenant afterwards.
     *
     * @template TReturn
     *
     * @param  callable(): TReturn  $callback
     * @return TReturn
     */
    public function run(?Tenant $tenant, callable $callback): mixed
    {
        $previous = $this->tenant;
        $this->tenant = $tenant;

        try {
            return $callback();
        } finally {
            $this->tenant = $previous;
        }
    }
}
