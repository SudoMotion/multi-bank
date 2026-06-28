import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Alert, Button, Card, Checkbox, Select } from '@/Components/UI';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Index({
    roles,
    permissionGroups,
    selectedRoleId,
    assignedPermissions,
}) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        role_id: selectedRoleId ?? '',
        permissions: assignedPermissions ?? [],
    });

    useEffect(() => {
        setData({
            role_id: selectedRoleId ?? '',
            permissions: assignedPermissions ?? [],
        });
    }, [selectedRoleId, assignedPermissions]);

    const handleRoleChange = (event) => {
        router.get(
            route('admin.permissions.index'),
            { role: event.target.value },
            { preserveState: true, preserveScroll: true },
        );
    };

    const togglePermission = (permission) => {
        setData(
            'permissions',
            data.permissions.includes(permission)
                ? data.permissions.filter((item) => item !== permission)
                : [...data.permissions, permission],
        );
    };

    const toggleGroup = (groupPermissions) => {
        const permissionKeys = Object.keys(groupPermissions);
        const allSelected = permissionKeys.every((permission) =>
            data.permissions.includes(permission),
        );

        if (allSelected) {
            setData(
                'permissions',
                data.permissions.filter((permission) => !permissionKeys.includes(permission)),
            );
            return;
        }

        setData('permissions', [
            ...new Set([...data.permissions, ...permissionKeys]),
        ]);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.permissions.update'));
    };

    return (
        <AdminLayout title="Permissions">
            <Head title="Permissions" />

            <AdminPageHeader
                title="Permissions"
                description="Assign page permissions to each role."
            />

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            {roles.length === 0 ? (
                <Card>
                    <p className="text-sm text-neutral-500">
                        Create a role first, then assign permissions here.
                    </p>
                </Card>
            ) : (
                <AdminForm onSubmit={submit} className="space-y-4">
                    <Card title="Select Role">
                        <Select
                            id="role_id"
                            label="Role"
                            value={String(data.role_id ?? '')}
                            placeholder=""
                            error={errors.role_id}
                            options={roles.map((role) => ({
                                value: String(role.id),
                                label:
                                    role.name.charAt(0).toUpperCase() + role.name.slice(1),
                            }))}
                            onChange={handleRoleChange}
                        />
                    </Card>

                    {Object.entries(permissionGroups).map(([groupName, groupPermissions]) => {
                        const permissionKeys = Object.keys(groupPermissions);
                        const selectedCount = permissionKeys.filter((permission) =>
                            data.permissions.includes(permission),
                        ).length;

                        return (
                            <Card
                                key={groupName}
                                title={groupName}
                                actions={
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => toggleGroup(groupPermissions)}
                                    >
                                        {selectedCount === permissionKeys.length
                                            ? 'Deselect All'
                                            : 'Select All'}
                                    </Button>
                                }
                            >
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {Object.entries(groupPermissions).map(
                                        ([permission, label]) => (
                                            <Checkbox
                                                key={permission}
                                                id={permission}
                                                label={label}
                                                checked={data.permissions.includes(permission)}
                                                onChange={() => togglePermission(permission)}
                                            />
                                        ),
                                    )}
                                </div>
                            </Card>
                        );
                    })}

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            Save Permissions
                        </Button>
                    </div>
                </AdminForm>
            )}
        </AdminLayout>
    );
}
