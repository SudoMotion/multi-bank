import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import TenantForm from '@/Components/Admin/TenantForm';
import { Alert, Button } from '@/Components/UI';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Edit({ bank, themes, baseDomain }) {
    const { flash } = usePage().props;

    const form = useForm({
        name: bank.name,
        slug: bank.slug,
        domain: bank.domain ?? '',
        tagline: bank.tagline ?? '',
        logo: null,
        theme: bank.theme,
        branding: { ...bank.branding },
        settings: {
            online_banking_url: bank.settings.online_banking_url ?? '',
            show_in_directory: bank.settings.show_in_directory,
        },
        is_active: bank.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('admin.tenants.update', bank.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title="Edit Bank">
            <Head title={`Edit ${bank.name}`} />

            <AdminPageHeader
                title={`Edit ${bank.name}`}
                backHref={route('admin.tenants.index')}
                backLabel="Back to banks"
                actions={
                    <a href={bank.url} target="_blank" rel="noreferrer">
                        <Button variant="secondary">Visit site</Button>
                    </a>
                }
            />

            {flash?.success && <Alert variant="success">{flash.success}</Alert>}

            <TenantForm
                form={form}
                onSubmit={submit}
                themes={themes}
                baseDomain={baseDomain}
                logoUrl={bank.logo_url}
            />
        </AdminLayout>
    );
}
