<?php

namespace App\Http\Requests\Admin;

use App\Support\Permissions;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

class StoreRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('roles.create') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('roles', 'name')->where(fn ($query) => $query->where('guard_name', 'web')),
                Rule::notIn([Permissions::SUPERADMIN_ROLE]),
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => strtolower(trim($this->input('name', ''))),
        ]);
    }
}
