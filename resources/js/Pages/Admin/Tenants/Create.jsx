import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import TenantForm from '@/Components/Admin/TenantForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ themes, baseDomain, defaultBranding }) {
    const form = useForm({
        name: '',
        slug: '',
        domain: '',
        tagline: '',
        logo: null,
        theme: 'default',
        branding: { ...defaultBranding },
        settings: { online_banking_url: '', show_in_directory: true },
        is_active: true,
        admin: { name: '', email: '', password: '' },
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('admin.tenants.store'), { forceFormData: true });
    };

    return (
        <AdminLayout title="Create Bank">
            <Head title="Create Bank" />

            <AdminPageHeader
                title="Create Bank"
                backHref={route('admin.tenants.index')}
                backLabel="Back to banks"
            />

            <TenantForm
                form={form}
                onSubmit={submit}
                themes={themes}
                baseDomain={baseDomain}
                isCreate
                submitLabel="Create Bank"
            />
        </AdminLayout>
    );
}
