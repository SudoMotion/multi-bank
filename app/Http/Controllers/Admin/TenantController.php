<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTenantRequest;
use App\Http\Requests\Admin\UpdateTenantRequest;
use App\Models\Setting;
use App\Models\Tenant;
use App\Models\User;
use App\Support\Permissions;
use App\Tenancy\TenantContext;
use App\Tenancy\ThemeRegistry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
    public function __construct(
        private readonly TenantContext $tenancy,
        private readonly ThemeRegistry $themes,
    ) {}

    public function index(): Response
    {
        $tenants = Tenant::query()
            ->withCount('users')
            ->orderBy('name')
            ->get()
            ->map(fn (Tenant $tenant) => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'slug' => $tenant->slug,
                'domain' => $tenant->domain,
                'host' => $tenant->primaryHost(),
                'url' => $tenant->url(),
                'logo_url' => $tenant->logoUrl(),
                'theme' => $this->themes->all()[$tenant->theme] ?? $tenant->theme,
                'is_active' => $tenant->is_active,
                'users_count' => $tenant->users_count,
            ]);

        return Inertia::render('Admin/Tenants/Index', [
            'tenants' => $tenants,
            'can' => [
                'create' => auth()->user()?->can('tenants.create') ?? false,
                'edit' => auth()->user()?->can('tenants.edit') ?? false,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Tenants/Create', $this->formOptions());
    }

    public function store(StoreTenantRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $tenant = Tenant::create($request->tenantAttributes());

            if ($request->hasFile('logo')) {
                $tenant->update(['logo' => $this->storeLogo($tenant, $request->file('logo'))]);
            }

            $this->tenancy->run($tenant, function () use ($request, $tenant) {
                Setting::current()->update(['application_name' => $tenant->name]);

                if ($request->wantsAdminUser()) {
                    $admin = User::create([
                        'name' => $request->validated('admin.name'),
                        'email' => $request->validated('admin.email'),
                        'password' => $request->validated('admin.password'),
                    ]);

                    $admin->forceFill(['email_verified_at' => now()])->save();
                    $admin->assignRole(Permissions::BANK_ADMIN_ROLE);
                }
            });
        });

        return redirect()
            ->route('admin.tenants.index')
            ->with('success', 'Bank created successfully.');
    }

    public function edit(Tenant $tenant): Response
    {
        return Inertia::render('Admin/Tenants/Edit', [
            ...$this->formOptions(),
            'bank' => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'slug' => $tenant->slug,
                'domain' => $tenant->domain,
                'tagline' => $tenant->tagline,
                'theme' => $tenant->theme,
                'logo_url' => $tenant->logoUrl(),
                'branding' => $tenant->brandingWithDefaults(),
                'settings' => [
                    'online_banking_url' => $tenant->setting('online_banking_url'),
                    'show_in_directory' => (bool) $tenant->setting('show_in_directory', true),
                ],
                'is_active' => $tenant->is_active,
                'url' => $tenant->url(),
            ],
        ]);
    }

    public function update(UpdateTenantRequest $request, Tenant $tenant): RedirectResponse
    {
        $data = $request->tenantAttributes();

        if ($request->hasFile('logo')) {
            if ($tenant->logo) {
                Storage::disk('public')->delete($tenant->logo);
            }

            $data['logo'] = $this->storeLogo($tenant, $request->file('logo'));
        }

        $tenant->update($data);

        return redirect()
            ->route('admin.tenants.edit', $tenant)
            ->with('success', 'Bank updated successfully.');
    }

    public function toggleStatus(Tenant $tenant): RedirectResponse
    {
        $tenant->update(['is_active' => ! $tenant->is_active]);

        return redirect()
            ->back()
            ->with('success', $tenant->is_active ? "{$tenant->name} activated." : "{$tenant->name} deactivated.");
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'themes' => collect($this->themes->all())
                ->map(fn (string $label, string $value) => ['value' => $value, 'label' => $label])
                ->values()
                ->all(),
            'baseDomain' => config('tenancy.base_domain'),
            'defaultBranding' => config('tenancy.default_branding'),
        ];
    }

    private function storeLogo(Tenant $tenant, UploadedFile $file): string
    {
        return $file->store($tenant->storageDirectory('branding'), 'public');
    }
}
