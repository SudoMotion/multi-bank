<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Platform\BankWorkspaceController;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTenantRequest;
use App\Http\Requests\Admin\UpdateTenantRequest;
use App\Models\Setting;
use App\Models\Tenant;
use App\Models\User;
use App\Support\GlobalSettings;
use App\Support\Permissions;
use App\Tenancy\TenantContext;
use App\Tenancy\ThemeRegistry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\PermissionRegistrar;

class TenantController extends Controller
{
    public function __construct(
        private readonly TenantContext $tenancy,
        private readonly ThemeRegistry $themes,
        private readonly GlobalSettings $globals,
    ) {}

    public function index(): Response
    {
        $tenants = Tenant::query()
            ->withCount(['users', 'customers', 'accounts'])
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
                'customers_count' => $tenant->customers_count,
                'accounts_count' => $tenant->accounts_count,
            ]);

        return Inertia::render('Admin/Tenants/Index', [
            'tenants' => $tenants,
            'can' => [
                'create' => auth()->user()?->can('tenants.create') ?? false,
                'edit' => auth()->user()?->can('tenants.edit') ?? false,
                'delete' => auth()->user()?->can('tenants.delete') ?? false,
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
     * Permanently removes a bank and everything it owns (users, customers,
     * accounts, transactions, settings, files). The bank must be deactivated
     * first and its slug typed back as confirmation.
     */
    public function destroy(Request $request, Tenant $tenant): RedirectResponse
    {
        if ($tenant->is_active) {
            throw ValidationException::withMessages([
                'confirm' => 'Deactivate the bank before deleting it.',
            ]);
        }

        $request->validate([
            'confirm' => ['required', 'string', Rule::in([$tenant->slug])],
        ], [
            'confirm.in' => 'Type the bank slug exactly to confirm.',
        ]);

        DB::transaction(function () use ($tenant) {
            $userIds = $tenant->users()->pluck('id');
            $tables = config('permission.table_names');
            $morphKey = config('permission.column_names.model_morph_key', 'model_id');

            foreach (['model_has_roles', 'model_has_permissions'] as $table) {
                DB::table($tables[$table])
                    ->where('model_type', (new User)->getMorphClass())
                    ->whereIn($morphKey, $userIds)
                    ->delete();
            }

            $tenant->delete();
        });

        Storage::disk('public')->deleteDirectory("tenants/{$tenant->id}");
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        if ((int) $request->session()->get(BankWorkspaceController::SESSION_KEY) === $tenant->id) {
            $request->session()->forget(BankWorkspaceController::SESSION_KEY);
        }

        return redirect()
            ->route('admin.tenants.index')
            ->with('success', "{$tenant->name} and all of its data were deleted.");
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
            'defaultTheme' => $this->themes->resolve($this->globals->get('system.default_bank_theme')),
            'defaultBranding' => [
                'primary_color' => $this->globals->get('system.default_primary_color'),
                'secondary_color' => $this->globals->get('system.default_secondary_color'),
            ],
        ];
    }

    private function storeLogo(Tenant $tenant, UploadedFile $file): string
    {
        return $file->store($tenant->storageDirectory('branding'), 'public');
    }
}
