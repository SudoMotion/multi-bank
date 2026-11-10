<?php

namespace App\Http\Requests\Admin\Platform;

use App\Models\Account;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('accounts.create') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'status' => ['required', Rule::in(array_keys(Account::STATUSES))],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function accountAttributes(): array
    {
        return [
            'name' => $this->validated('name'),
            'status' => $this->validated('status'),
        ];
    }
}
