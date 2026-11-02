<?php

namespace App\Actions;

use App\Http\Requests\Admin\UpdateSettingsRequest;
use App\Models\Setting;
use App\Support\GoogleMapEmbed;
use App\Support\SiteData;
use App\Tenancy\TenantContext;
use Illuminate\Support\Facades\Storage;

/**
 * Reads and writes the site settings of the active context (a bank, or the
 * platform). Shared by the bank's own admin and the super admin workspace.
 */
class SiteSettings
{
    public function __construct(private readonly TenantContext $tenancy) {}

    /**
     * @return array<string, mixed>
     */
    public function present(): array
    {
        $settings = Setting::current();

        return [
            'application_name' => $settings->application_name,
            'email' => $settings->email,
            'phone' => $settings->phone,
            'logo_url' => $settings->logo ? Storage::url($settings->logo) : null,
            'favicon_url' => $settings->favicon ? Storage::url($settings->favicon) : null,
            'favicon_preview_url' => SiteData::faviconUrl($settings),
            'address' => $settings->address,
            'google_map_embed_link' => GoogleMapEmbed::normalize($settings->google_map_embed_link),
            'social_media' => $settings->social_media ?? [],
        ];
    }

    public function update(UpdateSettingsRequest $request): void
    {
        $settings = Setting::current();
        $data = $request->safe()->except(['logo', 'favicon']);

        if ($request->hasFile('logo')) {
            if ($settings->logo) {
                Storage::disk('public')->delete($settings->logo);
            }

            $data['logo'] = $request->file('logo')->store($this->tenancy->storagePath('logos'), 'public');
        }

        if ($request->hasFile('favicon')) {
            if ($settings->favicon) {
                Storage::disk('public')->delete($settings->favicon);
            }

            $data['favicon'] = $request->file('favicon')->store($this->tenancy->storagePath('favicons'), 'public');
        }

        $data['social_media'] = collect($request->input('social_media', []))
            ->filter(fn (array $item) => filled($item['platform'] ?? null) || filled($item['url'] ?? null))
            ->values()
            ->all();

        $data['google_map_embed_link'] = GoogleMapEmbed::normalize($data['google_map_embed_link'] ?? null);

        $settings->update($data);
    }
}
