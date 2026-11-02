import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import SiteSettingsForm from '@/Components/Admin/SiteSettingsForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Alert } from '@/Components/UI';
import { Head, usePage } from '@inertiajs/react';

export default function Index({ settings }) {
    const { flash } = usePage().props;

    return (
        <AdminLayout title="Settings">
            <Head title="Settings" />

            <AdminPageHeader
                title="Settings"
                description="Manage application settings and contact information."
            />

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            <SiteSettingsForm settings={settings} submitUrl={route('admin.settings.update')} />
        </AdminLayout>
    );
}
