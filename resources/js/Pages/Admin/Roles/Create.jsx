import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Button, Card, Input } from '@/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.roles.store'));
    };

    return (
        <AdminLayout title="Create Role">
            <Head title="Create Role" />

            <AdminPageHeader
                title="Create Role"
                backHref={route('admin.roles.index')}
                backLabel="Back to roles"
            />

            <AdminForm onSubmit={submit}>
                <Card title="Role Details">
                    <AdminFormGrid>
                        <Input
                            id="name"
                            label="Role Name"
                            wrapperClassName="sm:col-span-2 lg:col-span-3 xl:col-span-4"
                            value={data.name}
                            placeholder="Manager"
                            error={errors.name}
                            required
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </AdminFormGrid>

                    <div className="mt-4 flex justify-end gap-3">
                        <Link href={route('admin.roles.index')}>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Save Role
                        </Button>
                    </div>
                </Card>
            </AdminForm>
        </AdminLayout>
    );
}
