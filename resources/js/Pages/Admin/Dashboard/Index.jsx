import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Card } from '@/Components/UI';
import { Head } from '@inertiajs/react';

export default function Index() {
    const stats = [
        { label: 'Total Users', value: '—' },
        { label: 'Products', value: '—' },
        { label: 'Orders', value: '—' },
        { label: 'Pending', value: '—' },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                <p className="mt-1 text-sm text-gray-500">Welcome to the admin panel.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.label} bodyClassName="p-5">
                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        <p className="mt-2 text-2xl font-semibold text-gray-900">{stat.value}</p>
                    </Card>
                ))}
            </div>

            <Card title="Recent Activity" className="mt-6">
                <p className="text-sm text-gray-500">Your admin content goes here.</p>
            </Card>
        </AdminLayout>
    );
}
