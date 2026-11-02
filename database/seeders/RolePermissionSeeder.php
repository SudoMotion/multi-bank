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

        Permission::query()
            ->whereNotIn('name', Permissions::all())
            ->each(fn (Permission $permission) => $permission->delete());

        $superadmin = Role::firstOrCreate([
            'name' => Permissions::SUPERADMIN_ROLE,
            'guard_name' => 'web',
        ]);

        $superadmin->syncPermissions(Permissions::all());

        $bankAdmin = Role::firstOrCreate([
            'name' => Permissions::BANK_ADMIN_ROLE,
            'guard_name' => 'web',
        ]);

        if ($bankAdmin->wasRecentlyCreated) {
            $bankAdmin->syncPermissions(Permissions::bankAdminDefaults());
        }

        $admin = User::where('email', 'admin@gmail.com')->first();

        if ($admin) {
            $admin->syncRoles([Permissions::SUPERADMIN_ROLE]);
        }
    }
}
