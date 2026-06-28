import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Button, Card, Input, Select } from '@/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ user, roles }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    return (
        <AdminLayout title="Edit User">
            <Head title="Edit User" />

            <AdminPageHeader
                title={`Edit User`}
                backHref={route('admin.users.index')}
                backLabel="Back to users"
            />

            <AdminForm onSubmit={submit}>
                <Card title="User Details">
                    <AdminFormGrid>
                        <Input
                            id="name"
                            label="Name"
                            wrapperClassName="sm:col-span-2 lg:col-span-2 xl:col-span-2"
                            value={data.name}
                            error={errors.name}
                            required
                            onChange={(e) => setData('name', e.target.value)}
                        />

                        <Select
                            id="role"
                            label="Role"
                            value={data.role}
                            placeholder="Select role"
                            error={errors.role}
                            options={roles}
                            onChange={(e) => setData('role', e.target.value)}
                        />

                        <Input
                            id="email"
                            label="Email"
                            wrapperClassName="sm:col-span-2 lg:col-span-2 xl:col-span-2"
                            type="email"
                            value={data.email}
                            error={errors.email}
                            required
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <Input
                            id="password"
                            label="New Password"
                            type="password"
                            value={data.password}
                            error={errors.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <Input
                            id="password_confirmation"
                            label="Confirm New Password"
                            type="password"
                            value={data.password_confirmation}
                            error={errors.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                        />
                    </AdminFormGrid>

                    <div className="mt-4 flex justify-end gap-3">
                        <Link href={route('admin.users.index')}>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Update User
                        </Button>
                    </div>
                </Card>
            </AdminForm>
        </AdminLayout>
    );
}
