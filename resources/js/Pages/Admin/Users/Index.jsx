import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import {
    ActionButtonGroup,
    Button,
    Card,
    DeleteAction,
    EditAction,
    ViewAction,
} from '@/Components/UI';
import { Head, Link } from '@inertiajs/react';

const sampleUsers = [
    { id: 1, name: 'Admin', email: 'admin@gmail.com', role: 'Administrator' },
    { id: 2, name: 'John Doe', email: 'john@example.com', role: 'Editor' },
    { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'Viewer' },
];

export default function Index() {
    return (
        <AdminLayout title="Users">
            <Head title="Users" />

            <AdminPageHeader
                title="Users"
                description="Manage application users."
                actions={
                    <Link href={route('admin.users.create')}>
                        <Button>Add User</Button>
                    </Link>
                }
            />

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
                            {sampleUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-neutral-50/50">
                                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-neutral-900">
                                        {user.name}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-600">
                                        {user.email}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-600">
                                        {user.role}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-right">
                                        <ActionButtonGroup className="justify-end">
                                            <ViewAction href={`#user-${user.id}`} />
                                            <EditAction
                                                href={route('admin.users.edit', user.id)}
                                            />
                                            <DeleteAction href={`#delete-user-${user.id}`} />
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
