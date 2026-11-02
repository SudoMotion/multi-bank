<?php

namespace App\Http\Requests\Admin\Platform;

use App\Support\Money;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTransactionRequest extends FormRequest
{
    public const OPERATIONS = [
        'deposit' => 'Deposit',
        'withdrawal' => 'Withdrawal',
        'transfer' => 'Transfer',
        'adjustment' => 'Adjustment',
    ];

    public function authorize(): bool
    {
        return $this->user()?->can('transactions.create') ?? false;
    }

    /**
     * Account ids are only checked for shape here; the ledger resolves them
     * inside the bank's tenant scope, so ids of other banks are rejected.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'operation' => ['required', Rule::in(array_keys(self::OPERATIONS))],
            'account_id' => ['required', 'integer'],
            'to_account_id' => ['required_if:operation,transfer', 'nullable', 'integer', 'different:account_id'],
            'direction' => ['required_if:operation,adjustment', 'nullable', Rule::in(['credit', 'debit'])],
            'amount' => ['required', 'string', 'regex:'.Money::DECIMAL_PATTERN],
            'description' => ['required_if:operation,adjustment', 'nullable', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'amount.regex' => 'Enter an amount like 250 or 250.00.',
            'to_account_id.required_if' => 'Choose the account to transfer to.',
            'to_account_id.different' => 'Choose two different accounts for a transfer.',
            'description.required_if' => 'Explain the reason for the adjustment.',
            'direction.required_if' => 'Choose whether the adjustment credits or debits the account.',
        ];
    }

    public function attributes(): array
    {
        return [
            'account_id' => 'account',
            'to_account_id' => 'destination account',
        ];
    }
}
