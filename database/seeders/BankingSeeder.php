<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Tenant;
use App\Tenancy\TenantContext;
use Illuminate\Database\Seeder;

/**
 * Demo customers for every bank (no accounts — those are created in admin).
 */
class BankingSeeder extends Seeder
{
    private const PEOPLE = [
        ['Olivia', 'Tremblay'],
        ['Liam', 'Gagnon'],
        ['Emma', 'Roy'],
        ['Noah', 'Côté'],
        ['Charlotte', 'Bouchard'],
        ['William', 'Gauthier'],
    ];

    public function run(TenantContext $tenancy): void
    {
        Tenant::query()->orderBy('id')->each(function (Tenant $tenant) use ($tenancy) {
            $tenancy->run($tenant, function () use ($tenant) {
                if (Customer::query()->exists()) {
                    $this->ensureDemoPasswords();

                    return;
                }

                foreach (self::PEOPLE as $index => [$first, $last]) {
                    Customer::create([
                        'first_name' => $first,
                        'last_name' => $last,
                        'email' => strtolower("{$first}.{$index}@{$tenant->slug}.test"),
                        'phone' => '+1 555 01'.str_pad((string) ($tenant->id * 10 + $index), 2, '0', STR_PAD_LEFT),
                        'password' => '123456789',
                        'status' => Customer::STATUS_ACTIVE,
                    ]);
                }
            });
        });
    }

    private function ensureDemoPasswords(): void
    {
        Customer::query()
            ->whereNull('password')
            ->each(function (Customer $customer) {
                $customer->forceFill(['password' => '123456789'])->save();
            });
    }
}
