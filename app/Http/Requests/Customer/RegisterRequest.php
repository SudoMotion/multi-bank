<?php

namespace App\Http\Requests\Customer;

use App\Models\Customer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => Str::lower(trim($this->input('email', ''))),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('customers', 'email'),
            ],
            'password' => ['required', 'confirmed', Password::defaults()],
        ];
    }

    public function customerAttributes(): array
    {
        return [
            'first_name' => $this->validated('first_name'),
            'last_name' => $this->validated('last_name'),
            'email' => $this->validated('email'),
            'password' => $this->validated('password'),
            'status' => Customer::STATUS_ACTIVE,
        ];
    }
}
