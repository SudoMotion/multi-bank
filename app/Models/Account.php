<?php

namespace App\Models;

use App\Tenancy\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
        'name',
        'type',
        'currency',
        'status',
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
            'opened_at' => 'datetime',
            'closed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Account $account) {
            $account->opened_at ??= now();
        });
    }

    public function customers(): BelongsToMany
    {
        return $this->belongsToMany(Customer::class, 'account_customer')
            ->withPivot('tenant_id')
            ->withTimestamps();
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
        if (filled($this->name)) {
            return $this->name;
        }

        $type = self::TYPES[$this->type] ?? ucfirst($this->type);
        $customer = $this->relationLoaded('customers')
            ? $this->customers->first()
            : $this->customers()->first();
        $suffix = $customer ? substr($customer->accountNumber(), -4) : '****';

        return "{$type} ••{$suffix}";
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (blank($term)) {
            return $query;
        }

        $like = '%'.addcslashes($term, '%_\\').'%';

        return $query->where(function (Builder $query) use ($term, $like) {
            $query->where('name', 'like', $like)
                ->orWhereHas('customers', fn (Builder $customer) => $customer->search($term));
        });
    }
}
