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

export default function Index({ users, can }) {
    const { flash } = usePage().props;

    return (
        <AdminLayout title="Users">
            <Head title="Users" />

            <AdminPageHeader
                title="Users"
                description="Manage application users."
                actions={
                    can.create ? (
                        <Link href={route('admin.users.create')}>
                            <Button>Add User</Button>
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
                                    Name
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Email
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Role
                                </th>
                                <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 bg-white">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-neutral-50/50">
                                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-neutral-900">
                                        {user.name}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-600">
                                        {user.email}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm capitalize text-neutral-600">
                                        {user.role ?? '—'}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-right">
                                        <ActionButtonGroup className="justify-end">
                                            {can.edit && (
                                                <EditAction
                                                    href={route('admin.users.edit', user.id)}
                                                />
                                            )}
                                            {can.delete && (
                                                <DeleteAction
                                                    href={route('admin.users.destroy', user.id)}
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
