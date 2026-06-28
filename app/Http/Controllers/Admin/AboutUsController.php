<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAboutUsRequest;
use App\Http\Requests\Admin\UpdateAboutUsRequest;
use App\Models\AboutUs;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AboutUsController extends Controller
{
    public function index(): Response
    {
        $entries = AboutUs::query()
            ->latest()
            ->get()
            ->map(fn (AboutUs $entry) => [
                'id' => $entry->id,
                'title' => $entry->title,
                'status' => $entry->status,
                'image_url' => $entry->image ? Storage::url($entry->image) : null,
            ]);

        return Inertia::render('Admin/AboutUs/Index', [
            'entries' => $entries,
            'can' => [
                'create' => auth()->user()?->can('about-us.create') ?? false,
                'edit' => auth()->user()?->can('about-us.edit') ?? false,
                'delete' => auth()->user()?->can('about-us.delete') ?? false,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/AboutUs/Create');
    }

    public function store(StoreAboutUsRequest $request): RedirectResponse
    {
        $data = $request->safe()->except('image');

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('about-us', 'public');
        }

        AboutUs::create($data);

        return redirect()
            ->route('admin.about-us.index')
            ->with('success', 'About us entry created successfully.');
    }

    public function edit(AboutUs $aboutUs): Response
    {
        return Inertia::render('Admin/AboutUs/Edit', [
            'entry' => [
                'id' => $aboutUs->id,
                'title' => $aboutUs->title,
                'description' => $aboutUs->description,
                'status' => $aboutUs->status,
                'image_url' => $aboutUs->image ? Storage::url($aboutUs->image) : null,
            ],
        ]);
    }

    public function update(UpdateAboutUsRequest $request, AboutUs $aboutUs): RedirectResponse
    {
        $data = $request->safe()->except('image');

        if ($request->hasFile('image')) {
            if ($aboutUs->image) {
                Storage::disk('public')->delete($aboutUs->image);
            }

            $data['image'] = $request->file('image')->store('about-us', 'public');
        }

        $aboutUs->update($data);

        return redirect()
            ->route('admin.about-us.index')
            ->with('success', 'About us entry updated successfully.');
    }

    public function destroy(AboutUs $aboutUs): RedirectResponse
    {
        if (! auth()->user()?->can('about-us.delete')) {
            abort(403);
        }

        if ($aboutUs->image) {
            Storage::disk('public')->delete($aboutUs->image);
        }

        $aboutUs->delete();

        return redirect()
            ->route('admin.about-us.index')
            ->with('success', 'About us entry deleted successfully.');
    }
}
