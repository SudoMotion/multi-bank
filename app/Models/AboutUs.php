<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutUs extends Model
{
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
}
