<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateAboutUsRequest;
use App\Models\AboutUs;
use App\Tenancy\TenantContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AboutUsController extends Controller
{
    public function index(): Response
    {
        $aboutUs = AboutUs::current();

        return Inertia::render('Admin/AboutUs/Index', [
            'aboutUs' => [
                'title' => $aboutUs->title,
                'description' => $aboutUs->description,
                'status' => $aboutUs->status ?? 'active',
                'image_url' => $aboutUs->image ? Storage::url($aboutUs->image) : null,
            ],
        ]);
    }

    public function update(UpdateAboutUsRequest $request, TenantContext $tenancy): RedirectResponse
    {
        $aboutUs = AboutUs::current();
        $data = $request->safe()->except('image');

        if ($request->hasFile('image')) {
            if ($aboutUs->image) {
                Storage::disk('public')->delete($aboutUs->image);
            }

            $data['image'] = $request->file('image')->store($tenancy->storagePath('about-us'), 'public');
        }

        $aboutUs->update($data);

        return redirect()
            ->route('admin.about-us.index')
            ->with('success', 'About us saved successfully.');
    }
}
