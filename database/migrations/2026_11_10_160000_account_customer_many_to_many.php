<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('account_customer', function (Blueprint $table) {
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('account_id')->constrained('accounts')->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->timestamps();

            $table->primary(['account_id', 'customer_id']);
            $table->index(['tenant_id', 'customer_id']);
        });

        $rows = DB::table('accounts')
            ->whereNotNull('customer_id')
            ->select(['id', 'tenant_id', 'customer_id'])
            ->get();

        $now = now();

        foreach ($rows as $row) {
            DB::table('account_customer')->insert([
                'tenant_id' => $row->tenant_id,
                'account_id' => $row->id,
                'customer_id' => $row->customer_id,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        Schema::table('accounts', function (Blueprint $table) {
            $table->dropForeign(['customer_id']);
            $table->dropColumn('customer_id');
        });
    }

    public function down(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            $table->foreignId('customer_id')->nullable()->after('tenant_id')->constrained('customers')->nullOnDelete();
        });

        $links = DB::table('account_customer')
            ->select(['account_id', 'customer_id'])
            ->orderBy('account_id')
            ->get()
            ->unique('account_id');

        foreach ($links as $link) {
            DB::table('accounts')->where('id', $link->account_id)->update(['customer_id' => $link->customer_id]);
        }

        Schema::dropIfExists('account_customer');
    }
};
