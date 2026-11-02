<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ $tenant->name }} — Temporarily unavailable</title>
        <style>
            body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: ui-sans-serif, system-ui, sans-serif; background: #f5f5f5; color: #262626; }
            main { max-width: 28rem; padding: 2rem; text-align: center; }
            h1 { font-size: 1.5rem; font-weight: 600; margin: 0 0 .75rem; }
            p { margin: 0; color: #525252; line-height: 1.6; }
        </style>
    </head>
    <body>
        <main>
            <h1>{{ $tenant->name }}</h1>
            <p>Online banking for this institution is temporarily unavailable. Please try again later.</p>
        </main>
    </body>
</html>
