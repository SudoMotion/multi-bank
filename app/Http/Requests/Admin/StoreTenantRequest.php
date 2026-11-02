<?php

namespace App\Http\Requests\Admin;

use App\Models\Tenant;

class StoreTenantRequest extends TenantRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('tenants.create') ?? false;
    }

    protected function tenant(): ?Tenant
    {
        return null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            ...$this->tenantRules(),
            'admin' => ['nullable', 'array'],
            'admin.name' => ['nullable', 'required_with:admin.email,admin.password', 'string', 'max:255'],
            'admin.email' => ['nullable', 'required_with:admin.name,admin.password', 'email', 'max:255', 'unique:users,email'],
            'admin.password' => ['nullable', 'required_with:admin.name,admin.email', 'string', 'min:8'],
        ];
    }

    public function wantsAdminUser(): bool
    {
        return filled($this->validated('admin.email'));
    }
}
