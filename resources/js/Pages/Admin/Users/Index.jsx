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

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Users</h2>
                    <p className="mt-1 text-sm text-gray-500">Manage application users.</p>
                </div>
                <Link href={route('admin.users.create')}>
                    <Button>Add User</Button>
                </Link>
            </div>

            <Card bodyClassName="p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {sampleUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                        {user.name}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {user.email}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {user.role}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right">
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
