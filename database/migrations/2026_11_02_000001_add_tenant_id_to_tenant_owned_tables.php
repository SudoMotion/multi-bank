<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Rows with a null tenant_id belong to the platform (central) context.
     *
     * @var list<string>
     */
    private array $tables = ['users', 'settings', 'about_us'];

    public function up(): void
    {
        foreach ($this->tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->foreignId('tenant_id')
                    ->nullable()
                    ->after('id')
                    ->constrained('tenants')
                    ->cascadeOnDelete();
            });
        }
    }

    public function down(): void
    {
        foreach ($this->tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropConstrainedForeignId('tenant_id');
            });
        }
    }
};
