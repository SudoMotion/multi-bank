<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $duplicates = DB::table('accounts')
            ->select('account_number')
            ->groupBy('account_number')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('account_number');

        foreach ($duplicates as $accountNumber) {
            $ids = DB::table('accounts')
                ->where('account_number', $accountNumber)
                ->orderBy('id')
                ->skip(1)
                ->pluck('id');

            foreach ($ids as $id) {
                DB::table('accounts')->where('id', $id)->update([
                    'account_number' => $this->uniqueSixteenDigitNumber(),
                ]);
            }
        }

        DB::table('accounts')
            ->orderBy('id')
            ->lazy()
            ->each(function (object $row) {
                if (strlen($row->account_number) === 16 && ctype_digit($row->account_number)) {
                    return;
                }

                DB::table('accounts')->where('id', $row->id)->update([
                    'account_number' => $this->uniqueSixteenDigitNumber(),
                ]);
            });

        Schema::table('accounts', function (Blueprint $table) {
            $table->dropUnique(['tenant_id', 'account_number']);
            $table->unique('account_number');
        });
    }

    public function down(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            $table->dropUnique(['account_number']);
            $table->unique(['tenant_id', 'account_number']);
        });
    }

    private function uniqueSixteenDigitNumber(): string
    {
        do {
            $digits = '';
            for ($i = 0; $i < 16; $i++) {
                $digits .= (string) random_int(0, 9);
            }
        } while (DB::table('accounts')->where('account_number', $digits)->exists());

        return $digits;
    }
};
