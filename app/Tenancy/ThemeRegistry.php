<?php

namespace App\Tenancy;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

/**
 * Themes live in resources/js/Themes/{key}. Each theme may override any page,
 * layout or component; anything missing falls back to the default app files.
 */
class ThemeRegistry
{
    public const DEFAULT = 'default';

    /**
     * @return array<string, string> theme key => label
     */
    public function all(): array
    {
        $themes = [self::DEFAULT => 'Default'];
        $directory = resource_path('js/Themes');

        if (File::isDirectory($directory)) {
            foreach (File::directories($directory) as $path) {
                $key = basename($path);
                $themes[$key] = Str::headline($key);
            }
        }

        return $themes;
    }

    public function exists(?string $theme): bool
    {
        return $theme !== null && array_key_exists($theme, $this->all());
    }

    public function resolve(?string $theme): string
    {
        return $this->exists($theme) ? $theme : self::DEFAULT;
    }

    /**
     * Vite entry for an Inertia page, preferring the theme's override.
     */
    public function pageEntry(string $component, ?string $theme): string
    {
        $theme = $this->resolve($theme);

        if ($theme !== self::DEFAULT) {
            $themed = "resources/js/Themes/{$theme}/Pages/{$component}.jsx";

            if (File::exists(base_path($themed))) {
                return $themed;
            }
        }

        return "resources/js/Pages/{$component}.jsx";
    }
}
