<?php

namespace App\Models;

use App\Tenancy\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A customer's bank account. The balance is in minor units (cents) and is
 * never mass assignable: every change goes through App\Banking\LedgerService
 * so it always matches the transaction history.
 */
class Account extends Model
{
    use BelongsToTenant;

    public const STATUS_ACTIVE = 'active';

    public const STATUS_FROZEN = 'frozen';

    public const STATUS_CLOSED = 'closed';

    public const STATUSES = [
        self::STATUS_ACTIVE => 'Active',
        self::STATUS_FROZEN => 'Frozen',
        self::STATUS_CLOSED => 'Closed',
    ];

    public const TYPES = [
        'checking' => 'Checking',
        'savings' => 'Savings',
        'business' => 'Business',
    ];

    /**
     * @var list<string>
     */
    protected $fillable = [
        'customer_id',
        'type',
        'currency',
    ];

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'balance' => 0,
        'status' => self::STATUS_ACTIVE,
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'balance' => 'integer',
            'customer_id' => 'integer',
            'opened_at' => 'datetime',
            'closed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Account $account) {
            $account->account_number ??= static::generateNumber();
            $account->opened_at ??= now();
        });
    }

    public static function generateNumber(): string
    {
        do {
            $number = '';
            for ($i = 0; $i < 16; $i++) {
                $number .= (string) random_int(0, 9);
            }
        } while (static::acrossTenants()->where('account_number', $number)->exists());

        return $number;
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    public function isClosed(): bool
    {
        return $this->status === self::STATUS_CLOSED;
    }

    public function label(): string
    {
        return (self::TYPES[$this->type] ?? ucfirst($this->type)).' ••'.substr($this->account_number, -4);
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (blank($term)) {
            return $query;
        }

        $like = '%'.addcslashes($term, '%_\\').'%';

        return $query->where(function (Builder $query) use ($like, $term) {
            $query->where('account_number', 'like', $like)
                ->orWhereHas('customer', fn (Builder $customer) => $customer->search($term));
        });
    }
}
