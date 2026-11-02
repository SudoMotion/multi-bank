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
    'central_domains' => array_values(array_filter(array_map(
        'trim',
        explode(',', (string) env('TENANCY_CENTRAL_DOMAINS', $appHost.',localhost')),
    ))),

    /*
    |--------------------------------------------------------------------------
    | Base Domain
    |--------------------------------------------------------------------------
    |
    | Banks are reachable at "{slug}.{base_domain}". Locally "*.localhost"
    | resolves to 127.0.0.1 in modern browsers, so no hosts file is needed.
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
    | Default Branding
    |--------------------------------------------------------------------------
    */
    'default_branding' => [
        'primary_color' => '#4B286D',
        'secondary_color' => '#1F2937',
    ],
];
