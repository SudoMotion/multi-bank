<?php

namespace App\Banking;

use App\Models\Account;
use App\Models\Transaction;
use App\Models\User;
use App\Support\GlobalSettings;
use App\Support\Money;
use App\Tenancy\TenantContext;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use LogicException;

/**
 * The only place balances change. Shared by every bank: each operation runs
 * in a DB transaction, locks the affected accounts (in id order, so
 * concurrent transfers cannot deadlock) and writes a ledger entry per leg.
 *
 * Must be called inside a tenant context (TenantContext::run()); the scoped
 * account lookup guarantees accounts of other banks cannot be touched.
 */
class LedgerService
{
    public function __construct(
        private readonly TenantContext $tenancy,
        private readonly GlobalSettings $settings,
    ) {}

    public function deposit(Account $account, int $amount, ?string $description = null, ?User $actor = null): Transaction
    {
        $this->assertAmount($amount);

        return DB::transaction(function () use ($account, $amount, $description, $actor) {
            $locked = $this->lock([$account->id])->first();
            $this->assertActive($locked);

            return $this->post($locked, Transaction::TYPE_DEPOSIT, $amount, $description, $actor);
        });
    }

    public function withdraw(Account $account, int $amount, ?string $description = null, ?User $actor = null): Transaction
    {
        $this->assertAmount($amount);

        return DB::transaction(function () use ($account, $amount, $description, $actor) {
            $locked = $this->lock([$account->id])->first();
            $this->assertActive($locked);
            $this->assertFunds($locked, $amount);

            return $this->post($locked, Transaction::TYPE_WITHDRAWAL, -$amount, $description, $actor);
        });
    }

    /**
     * @return array{0: Transaction, 1: Transaction} [debit leg, credit leg]
     */
    public function transfer(Account $from, Account $to, int $amount, ?string $description = null, ?User $actor = null): array
    {
        $this->assertAmount($amount);

        if ($from->is($to)) {
            throw new LedgerException('Choose two different accounts for a transfer.');
        }

        return DB::transaction(function () use ($from, $to, $amount, $description, $actor) {
            $locked = $this->lock([$from->id, $to->id]);
            $source = $locked->get($from->id);
            $target = $locked->get($to->id);

            $this->assertActive($source);
            $this->assertActive($target);

            if ($source->currency !== $target->currency) {
                throw new LedgerException('Transfers are only allowed between accounts of the same currency.');
            }

            $this->assertFunds($source, $amount);

            $reference = $this->reference();

            return [
                $this->post($source, Transaction::TYPE_TRANSFER_OUT, -$amount, $description, $actor, $reference, $target),
                $this->post($target, Transaction::TYPE_TRANSFER_IN, $amount, $description, $actor, $reference, $source),
            ];
        });
    }

    /**
     * Administrative correction. Allowed on frozen accounts, never on closed
     * ones, and can never make the balance negative.
     */
    public function adjust(Account $account, int $signedAmount, string $description, ?User $actor = null): Transaction
    {
        $this->assertAmount(abs($signedAmount));

        return DB::transaction(function () use ($account, $signedAmount, $description, $actor) {
            $locked = $this->lock([$account->id])->first();

            if ($locked->isClosed()) {
                throw new LedgerException('Closed accounts cannot be adjusted.');
            }

            if ($signedAmount < 0) {
                $this->assertFunds($locked, abs($signedAmount));
            }

            return $this->post($locked, Transaction::TYPE_ADJUSTMENT, $signedAmount, $description, $actor);
        });
    }

    public function maxAmount(): int
    {
        return (int) $this->settings->get('system.max_transaction_amount') * 100;
    }

    /**
     * @param  list<int>  $ids
     * @return Collection<int, Account>
     */
    private function lock(array $ids): Collection
    {
        if ($this->tenancy->isCentral()) {
            throw new LogicException('Ledger operations require an active bank context.');
        }

        $ids = array_values(array_unique($ids));
        sort($ids);

        $accounts = Account::query()
            ->whereKey($ids)
            ->orderBy('id')
            ->lockForUpdate()
            ->get()
            ->keyBy('id');

        if ($accounts->count() !== count($ids)) {
            throw new LedgerException('Account not found for this bank.');
        }

        return $accounts;
    }

    private function post(
        Account $account,
        string $type,
        int $signedAmount,
        ?string $description,
        ?User $actor,
        ?string $reference = null,
        ?Account $related = null,
    ): Transaction {
        $account->balance += $signedAmount;
        $account->save();

        $transaction = new Transaction;
        $transaction->forceFill([
            'account_id' => $account->id,
            'related_account_id' => $related?->id,
            'created_by' => $actor?->id,
            'reference' => $reference ?? $this->reference(),
            'type' => $type,
            'amount' => $signedAmount,
            'balance_after' => $account->balance,
            'currency' => $account->currency,
            'description' => $description,
        ])->save();

        return $transaction;
    }

    private function assertAmount(int $amount): void
    {
        if ($amount <= 0) {
            throw new LedgerException('The amount must be greater than zero.');
        }

        if ($amount > $this->maxAmount()) {
            throw new LedgerException('The amount exceeds the platform limit of '.Money::toDecimal($this->maxAmount()).' per transaction.');
        }
    }

    private function assertActive(Account $account): void
    {
        if (! $account->isActive()) {
            throw new LedgerException("Account {$account->account_number} is {$account->status}.");
        }
    }

    private function assertFunds(Account $account, int $amount): void
    {
        if ($account->balance < $amount) {
            throw new LedgerException("Insufficient funds in account {$account->account_number}.");
        }
    }

    private function reference(): string
    {
        return (string) Str::ulid();
    }
}
