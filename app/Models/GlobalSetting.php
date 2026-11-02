<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Platform-wide key/value configuration. Deliberately not tenant-scoped:
 * read it through App\Support\GlobalSettings, never from tenant site code.
 */
class GlobalSetting extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = ['key', 'value'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'value' => 'json',
        ];
    }
}
