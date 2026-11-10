<?php

namespace App\Http\Requests\Customer;

use App\Models\Customer;
use App\Tenancy\TenantContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateCustomerProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user('customer') !== null;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('email')) {
            $this->merge(['email' => Str::lower(trim((string) $this->input('email')))]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Customer $customer */
        $customer = $this->user('customer');
        $tenantId = app(TenantContext::class)->id();

        return [
            'section' => ['required', Rule::in(['address', 'phone', 'email'])],
            'address' => ['required_if:section,address', 'nullable', 'string', 'max:1000'],
            'mailing_address' => ['nullable', 'string', 'max:1000'],
            'phone' => ['required_if:section,phone', 'nullable', 'string', 'max:40'],
            'email' => [
                'required_if:section,email',
                'nullable',
                'email',
                'max:255',
                Rule::unique('customers', 'email')
                    ->where('tenant_id', $tenantId)
                    ->ignore($customer->id),
            ],
        ];
    }
}
