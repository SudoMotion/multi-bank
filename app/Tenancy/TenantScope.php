<?php

namespace App\Tenancy;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class TenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $column = $model->qualifyColumn('tenant_id');
        $tenantId = app(TenantContext::class)->id();

        if ($tenantId === null) {
            $builder->whereNull($column);

            return;
        }

        $builder->where($column, $tenantId);
    }
}
