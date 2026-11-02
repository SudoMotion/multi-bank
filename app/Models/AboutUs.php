<?php

namespace App\Models;

use App\Tenancy\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

class AboutUs extends Model
{
    use BelongsToTenant;

    protected $table = 'about_us';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'description',
        'image',
        'status',
    ];

    public static function current(): self
    {
        return static::query()->firstOrCreate([], [
            'title' => '',
            'description' => '',
            'status' => 'active',
        ]);
    }
}
