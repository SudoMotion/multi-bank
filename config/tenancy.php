<?php

$appHost = parse_url((string) env('APP_URL', 'http://localhost'), PHP_URL_HOST) ?: 'localhost';

return [
    /*
    |--------------------------------------------------------------------------
    | Central Domains
    |--------------------------------------------------------------------------
    |
    | Hosts that serve the platform itself (bank directory + platform admin).
    | Any other host is treated as a tenant (bank) host.
    |
    */
    'central_domains' => array_values(array_filter(array_unique(array_map(
        'trim',
        explode(',', (string) env('TENANCY_CENTRAL_DOMAINS', $appHost.',localhost,127.0.0.1')),
    )))),

    /*
    |--------------------------------------------------------------------------
    | Base Domain
    |--------------------------------------------------------------------------
    |
    | Legacy subdomains "{slug}.{base_domain}" redirect to "{app_url}/{slug}".
    |
    */
    'base_domain' => env('TENANCY_BASE_DOMAIN', 'localhost'),

    /*
    |--------------------------------------------------------------------------
    | Reserved Slugs
    |--------------------------------------------------------------------------
    */
    'reserved_slugs' => ['www', 'admin', 'api', 'app', 'mail', 'static', 'assets', 'cdn'],

    /*
    |--------------------------------------------------------------------------
    | Reserved Path Prefixes (central host)
    |--------------------------------------------------------------------------
    |
    | First path segment values that are not looked up as bank slugs on the
    | central domain (for example /admin/platform).
    |
    */
    'reserved_path_prefixes' => [
        'admin',
        'api',
        'sanctum',
        'up',
        'storage',
        'build',
        'vendor',
        'livewire',
        '_debugbar',
    ],

    /*
    |--------------------------------------------------------------------------
    | Default Branding
    |--------------------------------------------------------------------------
    */
    'default_branding' => [
        'primary_color' => '#4B286D',
        'secondary_color' => '#1F2937',
    ],
];
