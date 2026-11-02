import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Alert, Button, Card, Input } from '@/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ role }) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.roles.update', role.id));
    };

    return (
        <AdminLayout title="Edit Role">
            <Head title="Edit Role" />

            <AdminPageHeader
                title={`Edit Role`}
                backHref={route('admin.roles.index')}
                backLabel="Back to roles"
            />

            {role.is_protected && (
                <Alert inline className="mb-4">
                    The superadmin role name cannot be changed.
                </Alert>
            )}

            <AdminForm onSubmit={submit}>
                <Card title="Role Details">
                    <AdminFormGrid>
                        <Input
                            id="name"
                            label="Role Name"
                            wrapperClassName="sm:col-span-2 lg:col-span-3 xl:col-span-4"
                            value={data.name}
                            error={errors.name}
                            required
                            disabled={role.is_protected}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </AdminFormGrid>

                    <div className="mt-4 flex justify-end gap-3">
                        <Link href={route('admin.roles.index')}>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        {!role.is_protected && (
                            <Button type="submit" disabled={processing}>
                                Update Role
                            </Button>
                        )}
                    </div>
                </Card>
            </AdminForm>
        </AdminLayout>
    );
}
