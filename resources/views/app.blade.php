@php($tenant = app(\App\Tenancy\TenantContext::class)->get())
@php($themes = app(\App\Tenancy\ThemeRegistry::class))
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @if ($tenant) style="{{ $tenant->cssVariables() }}" @endif>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ $tenant?->name ?? config('app.name', 'Laravel') }}</title>

        @php($faviconUrl = \App\Support\SiteData::faviconUrl())
        @if ($faviconUrl)
            <link rel="icon" href="{{ $faviconUrl }}">
        @endif

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', $themes->pageEntry($page['component'], $tenant?->theme)])
        @inertiaHead
    </head>
    <body class="font-sans antialiased" data-theme="{{ $themes->resolve($tenant?->theme) }}">
        @inertia
    </body>
</html>
