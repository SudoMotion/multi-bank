<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreRoleRequest;
use App\Http\Requests\Admin\UpdateRoleRequest;
use App\Support\Permissions;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(): Response
    {
        $roles = Role::query()
            ->withCount('permissions')
            ->orderBy('name')
            ->get()
            ->map(fn (Role $role) => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions_count' => $role->permissions_count,
                'is_protected' => $role->name === Permissions::SUPERADMIN_ROLE,
            ]);

        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles,
            'can' => [
                'create' => auth()->user()?->can('roles.create') ?? false,
                'edit' => auth()->user()?->can('roles.edit') ?? false,
                'delete' => auth()->user()?->can('roles.delete') ?? false,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Roles/Create');
    }

    public function store(StoreRoleRequest $request): RedirectResponse
    {
        Role::create([
            'name' => $request->validated('name'),
            'guard_name' => 'web',
        ]);

        return redirect()
            ->route('admin.roles.index')
            ->with('success', 'Role created successfully.');
    }

    public function edit(Role $role): Response
    {
        return Inertia::render('Admin/Roles/Edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'is_protected' => $role->name === Permissions::SUPERADMIN_ROLE,
            ],
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        $role->update([
            'name' => $request->validated('name'),
        ]);

        return redirect()
            ->route('admin.roles.index')
            ->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        if ($role->name === Permissions::SUPERADMIN_ROLE) {
            return redirect()
                ->route('admin.roles.index')
                ->with('success', 'The superadmin role cannot be deleted.');
        }

        $role->delete();

        return redirect()
            ->route('admin.roles.index')
            ->with('success', 'Role deleted successfully.');
    }
}
