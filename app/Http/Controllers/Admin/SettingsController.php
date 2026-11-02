<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingsRequest;
use App\Models\Setting;
use App\Support\GoogleMapEmbed;
use App\Support\SiteData;
use App\Tenancy\TenantContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        $settings = Setting::current();

        return Inertia::render('Admin/Settings/Index', [
            'settings' => [
                'application_name' => $settings->application_name,
                'email' => $settings->email,
                'phone' => $settings->phone,
                'logo_url' => $settings->logo ? Storage::url($settings->logo) : null,
                'favicon_url' => $settings->favicon ? Storage::url($settings->favicon) : null,
                'favicon_preview_url' => SiteData::faviconUrl($settings),
                'address' => $settings->address,
                'google_map_embed_link' => GoogleMapEmbed::normalize($settings->google_map_embed_link),
                'social_media' => $settings->social_media ?? [],
            ],
        ]);
    }

    public function update(UpdateSettingsRequest $request, TenantContext $tenancy): RedirectResponse
    {
        $settings = Setting::current();
        $data = $request->safe()->except(['logo', 'favicon']);

        if ($request->hasFile('logo')) {
            if ($settings->logo) {
                Storage::disk('public')->delete($settings->logo);
            }

            $data['logo'] = $request->file('logo')->store($tenancy->storagePath('logos'), 'public');
        }

        if ($request->hasFile('favicon')) {
            if ($settings->favicon) {
                Storage::disk('public')->delete($settings->favicon);
            }

            $data['favicon'] = $request->file('favicon')->store($tenancy->storagePath('favicons'), 'public');
        }

        $data['social_media'] = collect($request->input('social_media', []))
            ->filter(fn (array $item) => filled($item['platform'] ?? null) || filled($item['url'] ?? null))
            ->values()
            ->all();

        $data['google_map_embed_link'] = GoogleMapEmbed::normalize($data['google_map_embed_link'] ?? null);

        $settings->update($data);

        return redirect()->route('admin.settings.index')->with('success', 'Settings saved successfully.');
    }
}
