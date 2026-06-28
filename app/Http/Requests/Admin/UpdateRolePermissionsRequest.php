<?php

namespace App\Http\Requests\Admin;

use App\Support\Permissions;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRolePermissionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('permissions.update') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'role_id' => [
                'required',
                'integer',
                Rule::exists('roles', 'id')->whereNot('name', Permissions::SUPERADMIN_ROLE),
            ],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string', Rule::in(Permissions::all())],
        ];
    }
}
