<?php

namespace Database\Seeders;

use App\Banking\LedgerException;
use App\Banking\LedgerService;
use App\Models\Account;
use App\Models\Customer;
use App\Models\Tenant;
use App\Tenancy\TenantContext;
use Illuminate\Database\Seeder;

/**
 * Demo customers, accounts and ledger history for every bank. Balances are
 * produced through LedgerService so they always match the transactions.
 * Banks that already have customers are skipped.
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

    public function run(TenantContext $tenancy, LedgerService $ledger): void
    {
        Tenant::query()->orderBy('id')->each(function (Tenant $tenant) use ($tenancy, $ledger) {
            $tenancy->run($tenant, function () use ($tenant, $ledger) {
                if (Customer::query()->exists()) {
                    $this->ensureDemoPasswords();

                    return;
                }

                $accounts = [];

                foreach (self::PEOPLE as $index => [$first, $last]) {
                    $customer = Customer::create([
                        'first_name' => $first,
                        'last_name' => $last,
                        'email' => strtolower("{$first}.{$index}@{$tenant->slug}.test"),
                        'phone' => '+1 555 01'.str_pad((string) ($tenant->id * 10 + $index), 2, '0', STR_PAD_LEFT),
                        'password' => '123456789',
                        'status' => Customer::STATUS_ACTIVE,
                    ]);

                    $checking = Account::create(['customer_id' => $customer->id, 'type' => 'checking', 'currency' => 'CAD']);
                    $ledger->deposit($checking, random_int(1500, 9000) * 100, 'Opening deposit');
                    $ledger->withdraw($checking, random_int(50, 400) * 100, 'ATM withdrawal');
                    $accounts[] = $checking;

                    if ($index % 2 === 0) {
                        $savings = Account::create(['customer_id' => $customer->id, 'type' => 'savings', 'currency' => 'CAD']);
                        $ledger->deposit($savings, random_int(5000, 40000) * 100, 'Opening deposit');
                        $accounts[] = $savings;
                    }
                }

                for ($i = 0; $i < 6; $i++) {
                    [$from, $to] = collect($accounts)->random(2)->all();

                    try {
                        $ledger->transfer($from, $to, random_int(20, 300) * 100, 'Transfer');
                    } catch (LedgerException) {
                        // Not enough funds in the random source account; skip.
                    }
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
