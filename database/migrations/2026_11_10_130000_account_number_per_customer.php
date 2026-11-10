<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $used = collect();

        DB::table('customers')->orderBy('id')->lazy()->each(function (object $row) use (&$used) {
            $number = $row->customer_number;

            if (strlen($number) !== 16 || ! ctype_digit($number)) {
                $linked = DB::table('accounts')
                    ->where('customer_id', $row->id)
                    ->get()
                    ->first(function (object $account) {
                        return strlen($account->account_number) === 16 && ctype_digit($account->account_number);
                    })
                    ?->account_number;

                $number = $linked ?: $this->uniqueSixteenDigitNumber($used);
            }

            while ($used->contains($number) || DB::table('customers')->where('customer_number', $number)->where('id', '!=', $row->id)->exists()) {
                $number = $this->uniqueSixteenDigitNumber($used);
            }

            $used->push($number);

            if ($number !== $row->customer_number) {
                DB::table('customers')->where('id', $row->id)->update(['customer_number' => $number]);
            }
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropUnique(['tenant_id', 'customer_number']);
            $table->unique('customer_number');
        });

        Schema::table('accounts', function (Blueprint $table) {
            $table->dropUnique(['account_number']);
            $table->dropColumn('account_number');
        });
    }

    public function down(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            $table->string('account_number', 20)->after('customer_id');
        });

        DB::table('accounts')->orderBy('id')->lazy()->each(function (object $row) {
            $number = DB::table('customers')->where('id', $row->customer_id)->value('customer_number')
                ?? $this->uniqueSixteenDigitNumber(collect());

            DB::table('accounts')->where('id', $row->id)->update(['account_number' => $number]);
        });

        Schema::table('accounts', function (Blueprint $table) {
            $table->unique('account_number');
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropUnique(['customer_number']);
            $table->unique(['tenant_id', 'customer_number']);
        });
    }

    /**
     * @param  Collection<int, string>  $used
     */
    private function uniqueSixteenDigitNumber(Collection $used): string
    {
        do {
            $digits = '';
            for ($i = 0; $i < 16; $i++) {
                $digits .= (string) random_int(0, 9);
            }
        } while (
            $used->contains($digits)
            || DB::table('customers')->where('customer_number', $digits)->exists()
        );

        return $digits;
    }
};
