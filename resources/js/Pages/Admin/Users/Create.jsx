import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Button, Card, Input, Select } from '@/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ roles }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AdminLayout title="Create User">
            <Head title="Create User" />

            <AdminPageHeader
                title="Create User"
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
                            label="Password"
                            type="password"
                            value={data.password}
                            error={errors.password}
                            required
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <Input
                            id="password_confirmation"
                            label="Confirm Password"
                            type="password"
                            value={data.password_confirmation}
                            error={errors.password_confirmation}
                            required
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
                            Save User
                        </Button>
                    </div>
                </Card>
            </AdminForm>
        </AdminLayout>
    );
}
