<?php

namespace App\Http\Controllers\Admin;

use App\Actions\SiteSettings;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingsRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function __construct(private readonly SiteSettings $siteSettings) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => $this->siteSettings->present(),
        ]);
    }

    public function update(UpdateSettingsRequest $request): RedirectResponse
    {
        $this->siteSettings->update($request);

        return redirect()->route('admin.settings.index')->with('success', 'Settings saved successfully.');
    }
}
