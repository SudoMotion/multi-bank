import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <AdminLayout title="Users">
            <Head title="Users" />

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Users</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Manage application users.
                </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">
                    User management will be implemented here.
                </p>
            </div>
        </AdminLayout>
    );
}
