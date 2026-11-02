<?php

namespace App\Support;

use App\Tenancy\TenantContext;

class Permissions
{
    public const SUPERADMIN_ROLE = 'superadmin';

    public const BANK_ADMIN_ROLE = 'bank-admin';

    /**
     * @return array<string, array<string, string>>
     */
    public static function groups(): array
    {
        return [
            'Dashboard' => [
                'dashboard.view' => 'View Dashboard',
            ],
            'Banks' => [
                'tenants.view' => 'View Banks',
                'tenants.create' => 'Create Banks',
                'tenants.edit' => 'Edit & Activate Banks',
                'tenants.delete' => 'Delete Banks',
            ],
            'Customers' => [
                'customers.view' => 'View Customers',
                'customers.create' => 'Create Customers',
                'customers.edit' => 'Edit Customers',
                'customers.delete' => 'Delete Customers',
            ],
            'Accounts' => [
                'accounts.view' => 'View Accounts',
                'accounts.create' => 'Open Accounts',
                'accounts.edit' => 'Freeze & Close Accounts',
            ],
            'Transactions' => [
                'transactions.view' => 'View Transactions',
                'transactions.create' => 'Post Transactions',
            ],
            'Global Settings' => [
                'global-settings.view' => 'View Global Settings',
                'global-settings.update' => 'Update Global Settings',
            ],
            'Users' => [
                'users.view' => 'View Users',
                'users.create' => 'Create Users',
                'users.edit' => 'Edit Users',
                'users.delete' => 'Delete Users',
            ],
            'About Us' => [
                'about-us.view' => 'View About Us',
                'about-us.update' => 'Update About Us',
            ],
            'Settings' => [
                'settings.view' => 'View Settings',
                'settings.update' => 'Update Settings',
            ],
            'Roles' => [
                'roles.view' => 'View Roles',
                'roles.create' => 'Create Roles',
                'roles.edit' => 'Edit Roles',
                'roles.delete' => 'Delete Roles',
            ],
            'Permissions' => [
                'permissions.view' => 'View Permissions',
                'permissions.update' => 'Update Permissions',
            ],
        ];
    }

    /**
     * @return list<string>
     */
    public static function all(): array
    {
        $permissions = [];

        foreach (self::groups() as $groupPermissions) {
            foreach ($groupPermissions as $name => $label) {
                $permissions[] = $name;
            }
        }

        return $permissions;
    }

    /**
     * Permissions that only make sense on the platform (central) domain.
     * Their routes are also guarded by the "central" middleware.
     *
     * @return list<string>
     */
    public static function centralOnly(): array
    {
        return array_values(array_filter(
            self::all(),
            fn (string $permission) => str_starts_with($permission, 'tenants.')
                || str_starts_with($permission, 'roles.')
                || str_starts_with($permission, 'permissions.')
                || str_starts_with($permission, 'global-settings.'),
        ));
    }

    /**
     * Roles that may not be assigned in the current context. Bank users can
     * never hold the platform superadmin role.
     *
     * @return list<string>
     */
    public static function restrictedRoles(): array
    {
        return app(TenantContext::class)->check() ? [self::SUPERADMIN_ROLE] : [];
    }

    /**
     * Default permissions for a bank's own administrator.
     *
     * @return list<string>
     */
    public static function bankAdminDefaults(): array
    {
        return array_values(array_diff(self::all(), self::centralOnly()));
    }
}
