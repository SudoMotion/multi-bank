<?php

namespace App\Support;

use App\Models\AboutUs;
use App\Models\Setting;
use App\Tenancy\TenantContext;
use Illuminate\Support\Facades\Storage;

class SiteData
{
    public static function faviconUrl(?Setting $settings = null): ?string
    {
        $settings ??= Setting::current();

        if ($settings->favicon) {
            return Storage::url($settings->favicon);
        }

        return self::logoUrl($settings);
    }

    public static function logoUrl(?Setting $settings = null): ?string
    {
        $settings ??= Setting::current();

        if ($settings->logo) {
            return Storage::url($settings->logo);
        }

        return app(TenantContext::class)->get()?->logoUrl();
    }

    /**
     * @return array<string, mixed>
     */
    public static function settings(): array
    {
        $settings = Setting::current();
        $tenant = app(TenantContext::class)->get();

        return [
            'name' => $settings->application_name ?: ($tenant?->name ?? config('app.name')),
            'email' => $settings->email,
            'phone' => $settings->phone,
            'address' => $settings->address,
            'logo_url' => self::logoUrl($settings),
            'favicon_url' => self::faviconUrl($settings),
            'favicon_only_url' => $settings->favicon ? Storage::url($settings->favicon) : null,
            'google_map_embed_link' => GoogleMapEmbed::normalize($settings->google_map_embed_link),
            'social_media' => collect($settings->social_media ?? [])
                ->filter(fn (array $item) => filled($item['platform'] ?? null) && filled($item['url'] ?? null))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function aboutUs(): ?array
    {
        $aboutUs = AboutUs::current();

        if ($aboutUs->status !== 'active') {
            return null;
        }

        return [
            'title' => $aboutUs->title,
            'description' => $aboutUs->description,
            'image_url' => $aboutUs->image ? Storage::url($aboutUs->image) : null,
        ];
    }
}
