import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Card } from '@/Components/UI';
import { Head } from '@inertiajs/react';

export default function Index() {
    const stats = [
        { label: 'Total Users', value: '—' },
        { label: 'About Us', value: '—' },
        { label: 'Orders', value: '—' },
        { label: 'Pending', value: '—' },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            <AdminPageHeader
                title="Dashboard"
                description="Welcome to the admin panel."
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.label} bodyClassName="p-4">
                        <p className="text-sm text-neutral-500">{stat.label}</p>
                        <p className="mt-2 text-2xl font-medium text-neutral-900">{stat.value}</p>
                    </Card>
                ))}
            </div>

            <Card title="Recent Activity" className="mt-4">
                <p className="text-sm text-neutral-500">Your admin content goes here.</p>
            </Card>
        </AdminLayout>
    );
}
