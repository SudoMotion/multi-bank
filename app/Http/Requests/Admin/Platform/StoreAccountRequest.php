<?php

namespace App\Http\Requests\Admin\Platform;

use App\Models\Account;
use App\Models\Customer;
use App\Models\Tenant;
use App\Support\GlobalSettings;
use App\Support\Money;
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
        /** @var Tenant $tenant */
        $tenant = $this->route('tenant');

        return [
            'customer_id' => [
                'required',
                'integer',
                Rule::exists('customers', 'id')
                    ->where('tenant_id', $tenant->id)
                    ->where('status', Customer::STATUS_ACTIVE),
            ],
            'type' => ['required', Rule::in(array_keys(Account::TYPES))],
            'currency' => ['required', Rule::in(app(GlobalSettings::class)->currencies())],
            'initial_deposit' => ['nullable', 'string', 'regex:'.Money::DECIMAL_PATTERN],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'customer_id.exists' => 'Choose an active customer of this bank.',
            'initial_deposit.regex' => 'Enter an amount like 250 or 250.00.',
        ];
    }
}
