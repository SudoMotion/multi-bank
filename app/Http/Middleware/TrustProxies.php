<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustProxies as Middleware;

class TrustProxies extends Middleware
{
    /**
     * @var string|list<string>|null
     */
    protected $proxies = '*';
}
