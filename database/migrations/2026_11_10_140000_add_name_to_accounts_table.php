<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            $table->string('name', 150)->default('')->after('customer_id');
            $table->foreignId('customer_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            $table->dropColumn('name');
            $table->foreignId('customer_id')->nullable(false)->change();
        });
    }
};
