<?php

namespace App\Tenancy\Concerns;

use App\Models\Tenant;
use App\Tenancy\TenantContext;
use App\Tenancy\TenantScope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Scopes every query to the active tenant (or to platform rows when no tenant
 * is active) and stamps new rows with the active tenant's id.
 *
 * tenant_id is intentionally never fillable; use TenantContext::run() to
 * create rows for another tenant.
 */
trait BelongsToTenant
{
    public static function bootBelongsToTenant(): void
    {
        static::addGlobalScope(new TenantScope);

        static::creating(function (self $model) {
            if ($model->getAttribute('tenant_id') === null) {
                $model->setAttribute('tenant_id', app(TenantContext::class)->id());
            }
        });
    }

    public function initializeBelongsToTenant(): void
    {
        $this->mergeCasts(['tenant_id' => 'integer']);
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Query across every tenant. Only for platform-level reporting.
     */
    public static function acrossTenants(): Builder
    {
        return static::withoutGlobalScope(TenantScope::class);
    }
}
