<?php

namespace App\Support;

class Permissions
{
    public const SUPERADMIN_ROLE = 'superadmin';

    /**
     * @return array<string, array<string, string>>
     */
    public static function groups(): array
    {
        return [
            'Dashboard' => [
                'dashboard.view' => 'View Dashboard',
            ],
            'Users' => [
                'users.view' => 'View Users',
                'users.create' => 'Create Users',
                'users.edit' => 'Edit Users',
                'users.delete' => 'Delete Users',
            ],
            'About Us' => [
                'about-us.view' => 'View About Us',
                'about-us.create' => 'Create About Us',
                'about-us.edit' => 'Edit About Us',
                'about-us.delete' => 'Delete About Us',
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
}
