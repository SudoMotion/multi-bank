<?php

namespace App\Http\Controllers\Admin\Platform;

use App\Actions\SiteSettings;
use App\Http\Requests\Admin\UpdateSettingsRequest;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

/**
 * Edits a bank's own site settings (the same data its bank admin edits under
 * Settings on the bank's domain).
 */
class BankSettingsController extends BankWorkspaceController
{
    public function index(Tenant $tenant, SiteSettings $siteSettings): Response
    {
        return $this->render($tenant, 'settings', 'Admin/Platform/Banks/Settings', [
            'settings' => $this->inBank($tenant, fn () => $siteSettings->present()),
        ]);
    }

    public function update(UpdateSettingsRequest $request, Tenant $tenant, SiteSettings $siteSettings): RedirectResponse
    {
        $this->inBank($tenant, fn () => $siteSettings->update($request));

        return redirect()
            ->route('admin.platform.banks.settings.index', $tenant)
            ->with('success', "{$tenant->name} site settings saved.");
    }
}
