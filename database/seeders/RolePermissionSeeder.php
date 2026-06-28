<?php

namespace Database\Seeders;

use App\Models\User;
use App\Support\Permissions;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        foreach (Permissions::all() as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $superadmin = Role::firstOrCreate([
            'name' => Permissions::SUPERADMIN_ROLE,
            'guard_name' => 'web',
        ]);

        $superadmin->syncPermissions(Permissions::all());

        $admin = User::where('email', 'admin@gmail.com')->first();

        if ($admin) {
            $admin->syncRoles([Permissions::SUPERADMIN_ROLE]);
        }
    }
}
