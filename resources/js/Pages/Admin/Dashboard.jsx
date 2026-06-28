import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
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
                    { label: 'Orders', value: '—' },
                    { label: 'Revenue', value: '—' },
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
                    Your admin content goes here. This area scrolls independently while the
                    topbar, sidebar, and footer stay fixed.
                </p>

                <div className="mt-6 space-y-3">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-md border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600"
                        >
                            Sample content row {index + 1} — scroll to verify fixed layout.
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
