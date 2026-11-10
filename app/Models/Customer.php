<?php

namespace App\Models;

use App\Tenancy\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Hidden(['password', 'remember_token'])]
class Customer extends Authenticatable
{
    use BelongsToTenant, Notifiable;

    public const STATUS_ACTIVE = 'active';

    public const STATUS_SUSPENDED = 'suspended';

    public const STATUSES = [
        self::STATUS_ACTIVE => 'Active',
        self::STATUS_SUSPENDED => 'Suspended',
    ];

    /**
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'date_of_birth',
        'address',
        'status',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'password' => 'hashed',
        ];
    }

    public function canAuthenticate(): bool
    {
        return $this->isActive() && filled($this->password);
    }

    protected static function booted(): void
    {
        static::creating(function (Customer $customer) {
            $customer->customer_number ??= static::generateAccountNumber();
        });
    }

    /** Globally unique 16-digit number assigned once per customer profile. */
    public static function generateAccountNumber(): string
    {
        do {
            $number = '';
            for ($i = 0; $i < 16; $i++) {
                $number .= (string) random_int(0, 9);
            }
        } while (static::acrossTenants()->where('customer_number', $number)->exists());

        return $number;
    }

    public function accountNumber(): string
    {
        return $this->customer_number;
    }

    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class);
    }

    public function fullName(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (blank($term)) {
            return $query;
        }

        return $query->where(function (Builder $query) use ($term) {
            $like = '%'.addcslashes($term, '%_\\').'%';

            $query->where('first_name', 'like', $like)
                ->orWhere('last_name', 'like', $like)
                ->orWhere('email', 'like', $like)
                ->orWhere('customer_number', 'like', $like)
                ->orWhereRaw("CONCAT(first_name, ' ', last_name) like ?", [$like]);
        });
    }
}
