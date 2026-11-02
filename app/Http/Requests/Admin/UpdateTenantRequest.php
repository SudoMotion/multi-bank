<?php

namespace App\Http\Requests\Admin;

use App\Models\Tenant;

class UpdateTenantRequest extends TenantRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('tenants.edit') ?? false;
    }

    protected function tenant(): ?Tenant
    {
        return $this->route('tenant');
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return $this->tenantRules();
    }
}
