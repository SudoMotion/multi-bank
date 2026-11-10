<?php

namespace App\Http\Controllers\Admin\Platform;

use App\Models\Transaction;

/**
 * @mixin BankWorkspaceController
 */
trait PresentsTransactions
{
    /**
     * Expects account.customers, relatedAccount and creator to be eager loaded.
     *
     * @return array<string, mixed>
     */
    protected function presentTransaction(Transaction $transaction): array
    {
        return [
            'id' => $transaction->id,
            'reference' => $transaction->reference,
            'type' => $transaction->type,
            'type_label' => Transaction::TYPES[$transaction->type] ?? $transaction->type,
            'status' => $transaction->status ?? Transaction::STATUS_COMPLETE,
            'status_label' => Transaction::STATUSES[$transaction->status ?? Transaction::STATUS_COMPLETE]
                ?? ($transaction->status ?? Transaction::STATUS_COMPLETE),
            'amount' => $this->money($transaction->amount, $transaction->currency),
            'balance_after' => $this->money($transaction->balance_after, $transaction->currency),
            'description' => $transaction->description,
            'created_at' => $transaction->created_at?->toIso8601String(),
            'created_at_label' => $transaction->created_at?->format('M j, Y g:i A'),
            'account' => $transaction->account ? [
                'id' => $transaction->account->id,
                'label' => $transaction->account->label(),
                'customer' => $transaction->account->customers
                    ->map(fn ($customer) => $customer->fullName())
                    ->implode(', ') ?: null,
                'account_number' => $transaction->account->customers->first()?->accountNumber(),
            ] : null,
            'related_account' => $transaction->relatedAccount?->label(),
            'created_by' => $transaction->relationLoaded('creator') ? $transaction->creator?->name : null,
        ];
    }
}
