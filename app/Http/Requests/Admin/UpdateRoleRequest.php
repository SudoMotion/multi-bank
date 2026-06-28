<?php

namespace App\Http\Requests\Admin;

use App\Support\Permissions;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

class UpdateRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('roles.edit') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Role $role */
        $role = $this->route('role');

        return [
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('roles', 'name')
                    ->where(fn ($query) => $query->where('guard_name', 'web'))
                    ->ignore($role->id),
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
