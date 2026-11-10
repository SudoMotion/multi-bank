<?php

namespace App\Http\Requests\Admin\Platform;

use App\Models\Customer;
use App\Models\Tenant;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
class CustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can($this->isMethod('post') ? 'customers.create' : 'customers.edit') ?? false;
    }

    protected function prepareForValidation(): void
    {
        $payload = [
            'email' => filled($this->input('email')) ? Str::lower(trim($this->input('email'))) : null,
        ];

        if ($this->has('account_number')) {
            $payload['account_number'] = preg_replace('/\D/', '', (string) $this->input('account_number'));
        }

        $this->merge($payload);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Tenant $tenant */
        $tenant = $this->route('tenant');

        $rules = [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('customers', 'email')
                    ->where('tenant_id', $tenant->id)
                    ->ignore($this->route('customer')),
            ],
            'phone' => ['nullable', 'string', 'max:40'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'address' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', Rule::in(array_keys(Customer::STATUSES))],
        ];

        $customerId = $this->route('customer');

        if ($customerId !== null) {
            $rules['account_number'] = [
                'required',
                'digits:16',
                Rule::unique('customers', 'customer_number')->ignore($customerId),
            ];
            $rules['account_ids'] = ['nullable', 'array'];
            $rules['account_ids.*'] = [
                'integer',
                Rule::exists('accounts', 'id')->where('tenant_id', $tenant->id),
            ];
        }

        return $rules;
    }

    /**
     * @return array<string, mixed>
     */
    public function customerAttributes(): array
    {
        $data = $this->safe()->only([
            'first_name',
            'last_name',
            'email',
            'phone',
            'date_of_birth',
            'address',
            'status',
        ]);

        if ($this->filled('account_number')) {
            $data['customer_number'] = $this->validated('account_number');
        }

        return $data;
    }
}
