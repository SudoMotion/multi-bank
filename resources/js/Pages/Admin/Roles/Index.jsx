import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import {
    ActionButtonGroup,
    Alert,
    Button,
    Card,
    DeleteAction,
    EditAction,
} from '@/Components/UI';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ roles, can }) {
    const { flash } = usePage().props;

    return (
        <AdminLayout title="Roles">
            <Head title="Roles" />

            <AdminPageHeader
                title="Roles"
                description="Create and manage user roles."
                actions={
                    can.create ? (
                        <Link href={route('admin.roles.create')}>
                            <Button>Add Role</Button>
                        </Link>
                    ) : null
                }
            />

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            <Card bodyClassName="p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Role
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Permissions
                                </th>
                                <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 bg-white">
                            {roles.map((role) => (
                                <tr key={role.id} className="hover:bg-neutral-50/50">
                                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium capitalize text-neutral-900">
                                        {role.name}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-600">
                                        {role.permissions_count}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-right">
                                        <ActionButtonGroup className="justify-end">
                                            {can.edit && (
                                                <EditAction
                                                    href={route('admin.roles.edit', role.id)}
                                                />
                                            )}
                                            {can.delete && !role.is_protected && (
                                                <DeleteAction
                                                    href={route('admin.roles.destroy', role.id)}
                                                />
                                            )}
                                        </ActionButtonGroup>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </AdminLayout>
    );
}
