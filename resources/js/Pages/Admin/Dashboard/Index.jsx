import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Welcome to the admin panel.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Total Users', value: '—' },
                    { label: 'Products', value: '—' },
                    { label: 'Orders', value: '—' },
                    { label: 'Pending', value: '—' },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
                    >
                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        <p className="mt-2 text-2xl font-semibold text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <p className="mt-2 text-sm text-gray-500">
                    Your admin content goes here.
                </p>
            </div>
        </AdminLayout>
    );
}
