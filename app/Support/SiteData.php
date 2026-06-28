<?php

namespace App\Support;

use App\Models\AboutUs;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;

class SiteData
{
    /**
     * @return array<string, mixed>
     */
    public static function settings(): array
    {
        $settings = Setting::current();

        return [
            'name' => $settings->application_name ?: config('app.name'),
            'email' => $settings->email,
            'phone' => $settings->phone,
            'address' => $settings->address,
            'logo_url' => $settings->logo ? Storage::url($settings->logo) : null,
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
