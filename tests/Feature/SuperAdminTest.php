<?php

namespace Tests\Feature;

use App\Banking\LedgerService;
use App\Models\Account;
use App\Models\Customer;
use App\Models\Setting;
use App\Models\Tenant;
use App\Models\Transaction;
use App\Models\User;
use App\Support\GlobalSettings;
use App\Support\Permissions;
use App\Tenancy\TenantContext;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SuperAdminTest extends TestCase
{
    use RefreshDatabase;

    private User $root;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        $this->seed(RolePermissionSeeder::class);

        $this->root = User::factory()->create(['email' => 'root@platform.test']);
        $this->root->assignRole(Permissions::SUPERADMIN_ROLE);
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

    private function centralUrl(string $path = '/'): string
    {
        return 'http://localhost/'.ltrim($path, '/');
    }

    private function tenantUrl(Tenant $tenant, string $path = '/'): string
    {
        $path = ltrim($path, '/');

        return 'http://localhost/'.$tenant->slug.($path !== '' ? '/'.$path : '');
    }

    private function inTenant(Tenant $tenant, callable $callback): mixed
    {
        return app(TenantContext::class)->run($tenant, $callback);
    }

    private function account(Tenant $tenant, int $balance = 0, string $currency = 'CAD'): Account
    {
        return $this->inTenant($tenant, function () use ($tenant, $balance, $currency) {
            $customer = Customer::create(['first_name' => 'Ada', 'last_name' => 'Lovelace', 'status' => 'active']);
            $account = Account::create(['type' => 'checking', 'currency' => $currency, 'name' => 'Primary']);
            $account->customers()->attach($customer->id, ['tenant_id' => $tenant->id]);

            if ($balance > 0) {
                app(LedgerService::class)->deposit($account, $balance);
            }

            return $account->fresh();
        });
    }

    private function globalPayload(array $overrides = []): array
    {
        $settings = app(GlobalSettings::class);
        $payload = [];

        foreach (array_keys($settings->schema()) as $group) {
            $payload[$group] = $settings->group($group);
        }

        return array_replace_recursive($payload, $overrides);
    }

    public function test_global_settings_drive_the_central_landing_page_only(): void
    {
        $bank = $this->tenant('alpha');

        $this->actingAs($this->root)
            ->put($this->centralUrl('admin/global-settings'), $this->globalPayload([
                'landing' => ['hero_title' => 'Banking for everyone', 'show_calculator' => false],
            ]))
            ->assertRedirect()
            ->assertSessionHasNoErrors();

        $this->get($this->centralUrl())
            ->assertInertia(fn (Assert $page) => $page
                ->component('Frontend/Home/Index')
                ->where('landing.hero_title', 'Banking for everyone')
                ->where('landing.show_calculator', false));

        auth()->logout();

        $this->get($this->tenantUrl($bank))
            ->assertInertia(fn (Assert $page) => $page
                ->component('Frontend/BankHome/Index')
                ->where('landing', null)
                ->where('site.name', 'Alpha Bank'));
    }

    public function test_global_settings_validate_default_currency(): void
    {
        $this->actingAs($this->root)
            ->put($this->centralUrl('admin/global-settings'), $this->globalPayload([
                'system' => ['supported_currencies' => 'CAD', 'default_currency' => 'USD'],
            ]))
            ->assertSessionHasErrors('system.default_currency');
    }

    public function test_global_settings_require_permission_and_central_host(): void
    {
        $bank = $this->tenant('alpha');
        $plain = User::factory()->create();

        $this->actingAs($plain)
            ->get($this->centralUrl('admin/global-settings'))
            ->assertForbidden();

        $bankAdmin = $this->inTenant($bank, function () {
            $user = User::factory()->create();
            $user->assignRole(Permissions::BANK_ADMIN_ROLE);

            return $user;
        });

        $this->actingAs($bankAdmin)
            ->get($this->tenantUrl($bank, 'admin/global-settings'))
            ->assertNotFound();
    }

    public function test_workspace_creates_customers_inside_the_selected_bank_only(): void
    {
        $alpha = $this->tenant('alpha');
        $beta = $this->tenant('beta');

        $this->actingAs($this->root)
            ->post($this->centralUrl("admin/platform/banks/{$alpha->id}/customers"), [
                'first_name' => 'Grace',
                'last_name' => 'Hopper',
                'email' => 'grace@example.test',
                'status' => 'active',
            ])
            ->assertRedirect();

        $customer = Customer::acrossTenants()->where('email', 'grace@example.test')->firstOrFail();
        $this->assertSame($alpha->id, $customer->tenant_id);

        $this->get($this->centralUrl("admin/platform/banks/{$beta->id}/customers"))
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Platform/Banks/Customers/Index')
                ->where('workspace.bank.id', $beta->id)
                ->has('customers.data', 0));

        $this->get($this->centralUrl("admin/platform/banks/{$alpha->id}/customers"))
            ->assertInertia(fn (Assert $page) => $page
                ->has('customers.data', 1)
                ->where('customers.data.0.name', 'Grace Hopper')
                ->where('tenant', null));
    }

    public function test_workspace_cannot_reach_records_of_another_bank(): void
    {
        $alpha = $this->tenant('alpha');
        $beta = $this->tenant('beta');
        $betaAccount = $this->account($beta, 10_000);

        $betaCustomerId = $this->inTenant($beta, fn () => $betaAccount->customers()->value('customers.id'));

        $this->actingAs($this->root)
            ->get($this->centralUrl("admin/platform/banks/{$alpha->id}/customers/{$betaCustomerId}"))
            ->assertNotFound();

        $this->get($this->centralUrl("admin/platform/banks/{$alpha->id}/accounts/{$betaAccount->id}"))
            ->assertNotFound();

        $this->post($this->centralUrl("admin/platform/banks/{$alpha->id}/transactions"), [
            'operation' => 'withdrawal',
            'account_id' => $betaAccount->id,
            'amount' => '50',
        ])->assertSessionHasErrors('account_id');

        $this->assertSame(10_000, $betaAccount->fresh()->balance);
    }

    public function test_workspace_routes_are_not_available_on_bank_domains(): void
    {
        $alpha = $this->tenant('alpha');
        $bankAdmin = $this->inTenant($alpha, function () {
            $user = User::factory()->create();
            $user->assignRole(Permissions::BANK_ADMIN_ROLE);

            return $user;
        });

        $this->actingAs($bankAdmin)
            ->get($this->tenantUrl($alpha, "admin/platform/banks/{$alpha->id}/customers"))
            ->assertNotFound();

        $this->get($this->tenantUrl($alpha, 'admin/platform'))
            ->assertNotFound();
    }

    public function test_ledger_posts_deposits_withdrawals_and_transfers(): void
    {
        $alpha = $this->tenant('alpha');
        $from = $this->account($alpha, 50_000);
        $to = $this->account($alpha);

        $this->actingAs($this->root);
        $url = $this->centralUrl("admin/platform/banks/{$alpha->id}/transactions");

        $this->post($url, ['operation' => 'deposit', 'account_id' => $from->id, 'amount' => '25.50'])
            ->assertSessionHasNoErrors();
        $this->post($url, ['operation' => 'withdrawal', 'account_id' => $from->id, 'amount' => '10'])
            ->assertSessionHasNoErrors();
        $this->post($url, ['operation' => 'transfer', 'account_id' => $from->id, 'to_account_id' => $to->id, 'amount' => '100'])
            ->assertSessionHasNoErrors();

        $this->assertSame(50_000 + 2_550 - 1_000 - 10_000, $from->fresh()->balance);
        $this->assertSame(10_000, $to->fresh()->balance);

        $legs = Transaction::acrossTenants()->whereIn('type', ['transfer_out', 'transfer_in'])->get();
        $this->assertCount(2, $legs);
        $this->assertSame(1, $legs->pluck('reference')->unique()->count());
        $this->assertSame($this->root->id, (int) $legs->first()->created_by);

        foreach ([$from, $to] as $account) {
            $this->assertSame(
                $account->fresh()->balance,
                (int) Transaction::acrossTenants()->where('account_id', $account->id)->sum('amount'),
            );
        }
    }

    public function test_ledger_rejects_overdrafts_and_amounts_over_the_global_limit(): void
    {
        $alpha = $this->tenant('alpha');
        $account = $this->account($alpha, 1_000);
        app(GlobalSettings::class)->update(['system' => ['max_transaction_amount' => 500]]);

        $this->actingAs($this->root);
        $url = $this->centralUrl("admin/platform/banks/{$alpha->id}/transactions");

        $this->post($url, ['operation' => 'withdrawal', 'account_id' => $account->id, 'amount' => '10.01'])
            ->assertSessionHasErrors(['amount' => 'Insufficient funds in account '.$account->label().'.']);

        $this->post($url, ['operation' => 'deposit', 'account_id' => $account->id, 'amount' => '500.01'])
            ->assertSessionHasErrors('amount');

        $this->assertSame(1_000, $account->fresh()->balance);
    }

    public function test_frozen_accounts_reject_transactions_and_closing_requires_zero_balance(): void
    {
        $alpha = $this->tenant('alpha');
        $account = $this->account($alpha, 1_000);

        $this->actingAs($this->root);
        $statusUrl = $this->centralUrl("admin/platform/banks/{$alpha->id}/accounts/{$account->id}/status");

        $this->patch($statusUrl, ['status' => 'closed'])->assertSessionHasErrors('status');

        $this->patch($statusUrl, ['status' => 'frozen'])->assertSessionHasNoErrors();
        $this->post($this->centralUrl("admin/platform/banks/{$alpha->id}/transactions"), [
            'operation' => 'deposit',
            'account_id' => $account->id,
            'amount' => '5',
        ])->assertSessionHasErrors('amount');

        $this->post($this->centralUrl("admin/platform/banks/{$alpha->id}/transactions"), [
            'operation' => 'adjustment',
            'direction' => 'debit',
            'account_id' => $account->id,
            'amount' => '10',
            'description' => 'Fee reversal',
        ])->assertSessionHasNoErrors();

        $this->patch($statusUrl, ['status' => 'closed'])->assertSessionHasNoErrors();
        $this->assertSame(Account::STATUS_CLOSED, $account->fresh()->status);
    }

    public function test_customer_with_linked_accounts_can_be_deleted(): void
    {
        $alpha = $this->tenant('alpha');
        $account = $this->account($alpha);
        $customerId = $this->inTenant($alpha, fn () => $account->customers()->value('customers.id'));

        $this->actingAs($this->root)
            ->delete($this->centralUrl("admin/platform/banks/{$alpha->id}/customers/{$customerId}"))
            ->assertRedirect();

        $this->assertFalse(Customer::acrossTenants()->whereKey($customerId)->exists());
        $this->assertTrue(Account::acrossTenants()->whereKey($account->id)->exists());
    }

    public function test_bank_site_settings_are_edited_in_the_bank_scope(): void
    {
        $alpha = $this->tenant('alpha');

        $this->actingAs($this->root)
            ->post($this->centralUrl("admin/platform/banks/{$alpha->id}/settings"), [
                'application_name' => 'Alpha Online',
                'email' => 'hello@alpha.test',
            ])
            ->assertSessionHasNoErrors();

        $this->assertSame('Alpha Online', $this->inTenant($alpha, fn () => Setting::current()->application_name));
        $this->assertNotSame('Alpha Online', Setting::current()->application_name);
    }

    public function test_sidebar_shortcut_opens_the_last_selected_bank(): void
    {
        $this->tenant('alpha');
        $beta = $this->tenant('beta');

        $this->actingAs($this->root)
            ->get($this->centralUrl("admin/platform/banks/{$beta->id}"))
            ->assertOk();

        $this->get($this->centralUrl('admin/platform/accounts'))
            ->assertRedirect(route('admin.platform.banks.accounts.index', $beta));
    }

    public function test_every_super_admin_page_renders(): void
    {
        $alpha = $this->tenant('alpha');
        $account = $this->account($alpha, 12_345);
        $customerId = $this->inTenant($alpha, fn () => $account->customers()->value('customers.id'));
        $base = "admin/platform/banks/{$alpha->id}";

        $pages = [
            'admin/platform' => 'Admin/Platform/Index',
            'admin/global-settings' => 'Admin/GlobalSettings/Index',
            'admin/banks' => 'Admin/Tenants/Index',
            'admin/banks/create' => 'Admin/Tenants/Create',
            $base => 'Admin/Platform/Banks/Overview',
            "{$base}/customers" => 'Admin/Platform/Banks/Customers/Index',
            "{$base}/customers/create" => 'Admin/Platform/Banks/Customers/Create',
            "{$base}/customers/{$customerId}" => 'Admin/Platform/Banks/Customers/Show',
            "{$base}/customers/{$customerId}/edit" => 'Admin/Platform/Banks/Customers/Edit',
            "{$base}/accounts" => 'Admin/Platform/Banks/Accounts/Index',
            "{$base}/accounts/create" => 'Admin/Platform/Banks/Accounts/Create',
            "{$base}/accounts/{$account->id}" => 'Admin/Platform/Banks/Accounts/Show',
            "{$base}/transactions" => 'Admin/Platform/Banks/Transactions/Index',
            "{$base}/transactions/create" => 'Admin/Platform/Banks/Transactions/Create',
            "{$base}/settings" => 'Admin/Platform/Banks/Settings',
        ];

        $this->actingAs($this->root);

        foreach ($pages as $path => $component) {
            $this->get($this->centralUrl($path))
                ->assertOk()
                ->assertInertia(fn (Assert $page) => $page->component($component)->where('tenant', null));
        }

        $this->get($this->centralUrl("{$base}/accounts/{$account->id}"))
            ->assertInertia(fn (Assert $page) => $page
                ->where('account.balance.minor', 12_345)
                ->where('account.balance.formatted', '$123.45')
                ->has('transactions.data', 1));
    }

    public function test_bank_delete_requires_deactivation_and_confirmation(): void
    {
        $alpha = $this->tenant('alpha');
        $account = $this->account($alpha, 5_000);
        $bankAdmin = $this->inTenant($alpha, function () {
            $user = User::factory()->create();
            $user->assignRole(Permissions::BANK_ADMIN_ROLE);

            return $user;
        });

        $this->actingAs($this->root);
        $url = $this->centralUrl("admin/banks/{$alpha->id}");

        $this->delete($url, ['confirm' => 'alpha'])->assertSessionHasErrors('confirm');

        $alpha->update(['is_active' => false]);

        $this->delete($url, ['confirm' => 'wrong'])->assertSessionHasErrors('confirm');
        $this->assertTrue(Tenant::query()->whereKey($alpha->id)->exists());

        $this->delete($url, ['confirm' => 'alpha'])->assertRedirect(route('admin.tenants.index'));

        $this->assertFalse(Tenant::query()->whereKey($alpha->id)->exists());
        $this->assertFalse(Account::acrossTenants()->whereKey($account->id)->exists());
        $this->assertFalse(User::acrossTenants()->whereKey($bankAdmin->id)->exists());
        $this->assertFalse(DB::table('model_has_roles')->where('model_id', $bankAdmin->id)->exists());
        $this->assertTrue(User::acrossTenants()->whereKey($this->root->id)->exists());
    }
}
