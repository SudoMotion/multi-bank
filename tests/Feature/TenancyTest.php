<?php

namespace Tests\Feature;

use App\Models\Setting;
use App\Models\Tenant;
use App\Models\User;
use App\Support\Permissions;
use App\Tenancy\TenantContext;
use App\Tenancy\ThemeRegistry;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TenancyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        $this->seed(RolePermissionSeeder::class);
    }

    private function tenant(string $slug, array $attributes = []): Tenant
    {
        return Tenant::create([
            'name' => ucfirst($slug).' Bank',
            'slug' => $slug,
            'theme' => 'default',
            'is_active' => true,
            ...$attributes,
        ]);
    }

    private function tenantUrl(Tenant $tenant, string $path = '/'): string
    {
        $path = ltrim($path, '/');

        return 'http://localhost/'.$tenant->slug.($path !== '' ? '/'.$path : '');
    }

    /**
     * Relative URLs reuse the previous request's host, so central requests
     * are always made against an explicit central host.
     */
    private function centralUrl(string $path = '/'): string
    {
        return 'http://localhost/'.ltrim($path, '/');
    }

    private function userFor(?Tenant $tenant, string $role, string $email): User
    {
        return app(TenantContext::class)->run($tenant, function () use ($role, $email) {
            $user = User::factory()->create(['email' => $email]);
            $user->assignRole($role);

            return $user;
        });
    }

    private function resetContext(): void
    {
        app(TenantContext::class)->set(null);
    }

    public function test_central_home_lists_only_active_banks(): void
    {
        $this->tenant('alpha');
        $this->tenant('beta', ['is_active' => false]);

        $this->get($this->centralUrl())
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Frontend/Home/Index')
                ->where('tenant', null)
                ->has('banks', 1)
                ->where('banks.0.name', 'Alpha Bank'));
    }

    public function test_path_prefix_identifies_the_tenant(): void
    {
        $tenant = $this->tenant('alpha');

        $this->get($this->tenantUrl($tenant))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Frontend/BankHome/Index')
                ->where('tenant.slug', 'alpha')
                ->where('site.name', 'Alpha Bank'));
    }

    public function test_subdomain_redirects_to_path_url(): void
    {
        $tenant = $this->tenant('alpha');

        $this->get('http://'.$tenant->subdomainHost().'/login')
            ->assertRedirect($tenant->url('login'));
    }

    public function test_custom_domain_identifies_the_tenant(): void
    {
        $this->tenant('alpha', ['domain' => 'online.alphabank.test']);

        $this->get('http://online.alphabank.test/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('tenant.slug', 'alpha'));
    }

    public function test_unknown_and_inactive_tenants_are_not_served(): void
    {
        $inactive = $this->tenant('beta', ['is_active' => false]);

        $this->get('http://localhost/missing/')->assertNotFound();
        $this->get('http://unknown-domain.test/')->assertNotFound();
        $this->get($this->tenantUrl($inactive))->assertStatus(503);
    }

    public function test_site_settings_are_isolated_per_tenant(): void
    {
        $alpha = $this->tenant('alpha');
        $beta = $this->tenant('beta');

        Setting::current()->update(['application_name' => 'Platform']);
        app(TenantContext::class)->run($alpha, fn () => Setting::current()->update(['application_name' => 'Alpha Online']));

        $this->get($this->tenantUrl($alpha))
            ->assertInertia(fn (Assert $page) => $page->where('site.name', 'Alpha Online'));

        $this->get($this->tenantUrl($beta))
            ->assertInertia(fn (Assert $page) => $page->where('site.name', 'Beta Bank'));

        $this->get($this->centralUrl())
            ->assertInertia(fn (Assert $page) => $page->where('site.name', 'Platform'));

        $this->resetContext();
        $this->assertSame(3, Setting::acrossTenants()->count());
    }

    public function test_tenant_users_can_only_sign_in_on_their_own_bank(): void
    {
        $alpha = $this->tenant('alpha');
        $beta = $this->tenant('beta');
        $this->userFor($alpha, Permissions::BANK_ADMIN_ROLE, 'staff@alpha.test');

        $this->post($this->tenantUrl($beta, '/admin/login'), [
            'email' => 'staff@alpha.test',
            'password' => 'password',
        ]);
        $this->assertGuest();

        $this->post($this->centralUrl('/admin/login'), ['email' => 'staff@alpha.test', 'password' => 'password']);
        $this->assertGuest();

        $this->post($this->tenantUrl($alpha, '/admin/login'), [
            'email' => 'staff@alpha.test',
            'password' => 'password',
        ]);
        $this->assertAuthenticated();
    }

    public function test_a_session_from_another_tenant_is_rejected(): void
    {
        $alpha = $this->tenant('alpha');
        $beta = $this->tenant('beta');
        $user = $this->userFor($alpha, Permissions::BANK_ADMIN_ROLE, 'staff@alpha.test');

        $this->actingAs($user)
            ->get($this->tenantUrl($beta, '/admin/dashboard'))
            ->assertForbidden();
    }

    public function test_bank_admin_sees_only_their_users_and_no_platform_routes(): void
    {
        $alpha = $this->tenant('alpha');
        $beta = $this->tenant('beta');
        $admin = $this->userFor($alpha, Permissions::BANK_ADMIN_ROLE, 'admin@alpha.test');
        $this->userFor($beta, Permissions::BANK_ADMIN_ROLE, 'admin@beta.test');
        $this->userFor(null, Permissions::SUPERADMIN_ROLE, 'root@platform.test');

        $this->actingAs($admin)
            ->get($this->tenantUrl($alpha, '/admin/users'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('users', 1)
                ->where('users.0.email', 'admin@alpha.test'));

        foreach (['/admin/banks', '/admin/roles', '/admin/permissions'] as $path) {
            $this->actingAs($admin)->get($this->tenantUrl($alpha, $path))->assertNotFound();
        }
    }

    public function test_bank_admin_cannot_grant_superadmin_or_touch_other_banks(): void
    {
        $alpha = $this->tenant('alpha');
        $beta = $this->tenant('beta');
        $admin = $this->userFor($alpha, Permissions::BANK_ADMIN_ROLE, 'admin@alpha.test');
        $betaUser = $this->userFor($beta, Permissions::BANK_ADMIN_ROLE, 'admin@beta.test');

        $this->actingAs($admin)
            ->post($this->tenantUrl($alpha, '/admin/users'), [
                'name' => 'Sneaky',
                'email' => 'sneaky@alpha.test',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'role' => Permissions::SUPERADMIN_ROLE,
            ])
            ->assertSessionHasErrors('role');

        $this->actingAs($admin)
            ->get($this->tenantUrl($alpha, "/admin/users/{$betaUser->id}/edit"))
            ->assertNotFound();
    }

    public function test_superadmin_creates_a_bank_with_its_administrator(): void
    {
        $root = $this->userFor(null, Permissions::SUPERADMIN_ROLE, 'root@platform.test');

        $this->actingAs($root)
            ->post($this->centralUrl('/admin/banks'), [
                'name' => 'Gamma Bank',
                'slug' => 'gamma',
                'domain' => 'https://Online.GammaBank.test/',
                'theme' => 'default',
                'branding' => ['primary_color' => '#112233', 'secondary_color' => '#445566'],
                'settings' => ['show_in_directory' => '1'],
                'is_active' => '1',
                'admin' => ['name' => 'Gamma Admin', 'email' => 'admin@gamma.test', 'password' => 'password123'],
            ])
            ->assertRedirect(route('admin.tenants.index'))
            ->assertSessionHasNoErrors();

        $tenant = Tenant::where('slug', 'gamma')->firstOrFail();
        $this->assertSame('online.gammabank.test', $tenant->domain);
        $this->assertSame('#112233', $tenant->branding['primary_color']);

        $admin = User::acrossTenants()->where('email', 'admin@gamma.test')->firstOrFail();
        $this->assertSame($tenant->id, $admin->tenant_id);
        $this->assertTrue($admin->hasRole(Permissions::BANK_ADMIN_ROLE));
        $this->assertNotNull($admin->email_verified_at);
        $this->assertFalse($admin->isSuperAdmin());
    }

    public function test_bank_edit_page_keeps_the_central_tenant_context(): void
    {
        $root = $this->userFor(null, Permissions::SUPERADMIN_ROLE, 'root@platform.test');
        $tenant = $this->tenant('alpha');

        $this->actingAs($root)
            ->get($this->centralUrl("/admin/banks/{$tenant->id}/edit"))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Tenants/Edit')
                ->where('tenant', null)
                ->where('bank.slug', 'alpha'));
    }

    public function test_bank_slug_and_domain_are_validated(): void
    {
        $root = $this->userFor(null, Permissions::SUPERADMIN_ROLE, 'root@platform.test');
        $this->tenant('alpha');

        $this->actingAs($root)
            ->post($this->centralUrl('/admin/banks'), [
                'name' => 'Bad',
                'slug' => 'alpha',
                'domain' => 'beta.localhost',
                'theme' => 'missing-theme',
            ])
            ->assertSessionHasErrors(['slug', 'domain', 'theme']);

        $this->actingAs($root)
            ->post($this->centralUrl('/admin/banks'), ['name' => 'Bad', 'slug' => 'www', 'theme' => 'default'])
            ->assertSessionHasErrors('slug');
    }

    public function test_superadmin_can_deactivate_and_reactivate_a_bank(): void
    {
        $root = $this->userFor(null, Permissions::SUPERADMIN_ROLE, 'root@platform.test');
        $tenant = $this->tenant('alpha');

        $this->actingAs($root)->patch($this->centralUrl("/admin/banks/{$tenant->id}/status"))->assertRedirect();
        $this->assertFalse($tenant->fresh()->is_active);
        $this->get($this->tenantUrl($tenant))->assertStatus(503);

        $this->resetContext();
        $this->actingAs($root)->patch($this->centralUrl("/admin/banks/{$tenant->id}/status"));
        $this->assertTrue($tenant->fresh()->is_active);
    }

    public function test_theme_override_falls_back_to_default_pages(): void
    {
        $tenant = $this->tenant('alpha', ['theme' => 'heritage']);

        $this->get($this->tenantUrl($tenant))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Frontend/BankHome/Index')
                ->where('tenant.theme', 'heritage'));

        $themes = app(ThemeRegistry::class);
        $this->assertSame(
            'resources/js/Themes/heritage/Pages/Frontend/BankHome/Index.jsx',
            $themes->pageEntry('Frontend/BankHome/Index', 'heritage'),
        );
        $this->assertSame(
            'resources/js/Pages/Frontend/About/Index.jsx',
            $themes->pageEntry('Frontend/About/Index', 'heritage'),
        );
    }
}
