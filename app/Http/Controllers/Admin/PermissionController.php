<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateRolePermissionsRequest;
use App\Support\Permissions;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{
    public function index(): Response
    {
        $roles = Role::query()
            ->where('name', '!=', Permissions::SUPERADMIN_ROLE)
            ->orderBy('name')
            ->get(['id', 'name']);

        $selectedRoleId = (int) request('role', $roles->first()?->id ?? 0);
        $selectedRole = $roles->firstWhere('id', $selectedRoleId);

        $assignedPermissions = $selectedRole
            ? $selectedRole->permissions()->pluck('name')->values()->all()
            : [];

        return Inertia::render('Admin/Permissions/Index', [
            'roles' => $roles,
            'permissionGroups' => Permissions::groups(),
            'selectedRoleId' => $selectedRoleId ?: null,
            'assignedPermissions' => $assignedPermissions,
        ]);
    }

    public function update(UpdateRolePermissionsRequest $request): RedirectResponse
    {
        $role = Role::findOrFail($request->validated('role_id'));

        if ($role->name === Permissions::SUPERADMIN_ROLE) {
            abort(403, 'Superadmin permissions cannot be modified.');
        }

        $role->syncPermissions($request->validated('permissions', []));

        return redirect()
            ->route('admin.permissions.index', ['role' => $role->id])
            ->with('success', 'Permissions updated successfully.');
    }
}
