<?php

namespace App\Http\Requests\Admin\Platform;

use App\Models\Account;
use App\Models\Customer;
use App\Models\Tenant;
use App\Models\Transaction;
use App\Support\Money;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreCustomerTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('transactions.create') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Tenant $tenant */
        $tenant = $this->route('tenant');

        return [
            'account_id' => [
                'required',
                'integer',
                Rule::exists('accounts', 'id')->where('tenant_id', $tenant->id),
            ],
            'type' => ['required', Rule::in(array_keys(Transaction::CUSTOMER_TYPES))],
            'amount' => ['required', 'string', 'regex:'.Money::DECIMAL_PATTERN],
            'status' => ['required', Rule::in(array_keys(Transaction::STATUSES))],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            /** @var Tenant $tenant */
            $tenant = $this->route('tenant');
            $customerId = (int) $this->route('customer');

            $account = Account::query()
                ->where('tenant_id', $tenant->id)
                ->whereKey($this->input('account_id'))
                ->first();

            if ($account === null) {
                return;
            }

            if (! $account->customers()->whereKey($customerId)->exists()) {
                $validator->errors()->add('account_id', 'Choose an account assigned to this customer.');
            }
        });
    }

    public function messages(): array
    {
        return [
            'amount.regex' => 'Enter an amount like 250 or 250.00.',
        ];
    }
}
