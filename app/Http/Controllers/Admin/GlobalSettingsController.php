<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateGlobalSettingsRequest;
use App\Support\GlobalSettings;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class GlobalSettingsController extends Controller
{
    public function __construct(private readonly GlobalSettings $settings) {}

    public function index(): Response
    {
        $values = [];

        foreach (array_keys($this->settings->schema()) as $group) {
            $values[$group] = $this->settings->group($group);
        }

        return Inertia::render('Admin/GlobalSettings/Index', [
            'groups' => $this->settings->formGroups(),
            'values' => $values,
        ]);
    }

    public function update(UpdateGlobalSettingsRequest $request): RedirectResponse
    {
        $this->settings->update($request->validated());

        return redirect()
            ->route('admin.global-settings.index')
            ->with('success', 'Global settings saved successfully.');
    }
}
