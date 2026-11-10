<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\Customer;
use App\Models\Tenant;
use App\Tenancy\TenantContext;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CustomerPortalTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        $this->seed(RolePermissionSeeder::class);
    }

    private function tenant(string $slug = 'rbc'): Tenant
    {
        return Tenant::create([
            'name' => strtoupper($slug).' Bank',
            'slug' => $slug,
            'theme' => 'default',
            'is_active' => true,
        ]);
    }

    private function tenantUrl(Tenant $tenant, string $path = '/'): string
    {
        return 'http://'.$tenant->subdomainHost().'/'.ltrim($path, '/');
    }

    private function centralUrl(string $path = '/'): string
    {
        return 'http://localhost/'.ltrim($path, '/');
    }

    public function test_customer_routes_are_unavailable_on_central_host(): void
    {
        $this->get($this->centralUrl('login'))->assertRedirect('/admin/login');
        $this->get($this->centralUrl('register'))->assertNotFound();
        $this->get($this->centralUrl('dashboard'))->assertRedirect('/admin/dashboard');
    }

    public function test_customer_can_register_and_view_dashboard(): void
    {
        $tenant = $this->tenant();

        $this->get($this->tenantUrl($tenant, '/register'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Customer/Auth/Register'));

        $this->post($this->tenantUrl($tenant, '/register'), [
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertRedirect(route('customer.dashboard', absolute: false));

        $this->get($this->tenantUrl($tenant, '/dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Customer/Dashboard/Index')
                ->where('customer.email', 'jane@example.com')
                ->has('accounts', 0));
    }

    public function test_seeded_customer_can_sign_in_and_see_accounts(): void
    {
        $tenant = $this->tenant('bmo');

        $customer = app(TenantContext::class)->run($tenant, function () {
            $customer = Customer::create([
                'first_name' => 'Olivia',
                'last_name' => 'Tremblay',
                'email' => 'olivia@bmo.test',
                'password' => '123456789',
                'status' => Customer::STATUS_ACTIVE,
            ]);

            $account = Account::create([
                'type' => 'checking',
                'currency' => 'CAD',
                'balance' => 125000,
                'name' => 'Everyday',
            ]);
            $account->customers()->attach($customer->id, ['tenant_id' => $tenant->id]);

            return $customer;
        });

        $this->post($this->tenantUrl($tenant, '/login'), [
            'email' => $customer->email,
            'password' => '123456789',
        ])->assertRedirect(route('customer.dashboard', absolute: false));

        $this->get($this->tenantUrl($tenant, '/dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('accounts', 1)
                ->where('accounts.0.balance', '1250.00'));
    }
}
