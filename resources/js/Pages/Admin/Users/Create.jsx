import AdminLayout from '@/Layouts/Admin/AdminLayout';
import {
    Button,
    Card,
    Checkbox,
    FormField,
    Input,
    Radio,
    Select,
} from '@/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, processing, errors } = useForm({
        name: '',
        email: '',
        role: '',
        status: 'active',
        notify: true,
    });

    const submit = (e) => {
        e.preventDefault();
    };

    return (
        <AdminLayout title="Create User">
            <Head title="Create User" />

            <div className="mb-6">
                <Link
                    href={route('admin.users.index')}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                    &larr; Back to users
                </Link>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">Create User</h2>
            </div>

            <form onSubmit={submit}>
                <Card title="User Details">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                            className="sm:col-span-2"
                            label="Name"
                            htmlFor="name"
                            error={errors.name}
                            required
                        >
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </FormField>

                        <FormField
                            className="sm:col-span-2"
                            label="Email"
                            htmlFor="email"
                            error={errors.email}
                            required
                        >
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </FormField>

                        <FormField label="Role" htmlFor="role" error={errors.role}>
                            <Select
                                id="role"
                                value={data.role}
                                placeholder="Select role"
                                options={[
                                    { value: 'administrator', label: 'Administrator' },
                                    { value: 'editor', label: 'Editor' },
                                    { value: 'viewer', label: 'Viewer' },
                                ]}
                                onChange={(e) => setData('role', e.target.value)}
                            />
                        </FormField>

                        <FormField label="Status" error={errors.status}>
                            <div className="flex flex-wrap gap-4 pt-1">
                                <Radio
                                    id="user_status_active"
                                    name="status"
                                    value="active"
                                    label="Active"
                                    checked={data.status === 'active'}
                                    onChange={() => setData('status', 'active')}
                                />
                                <Radio
                                    id="user_status_inactive"
                                    name="status"
                                    value="inactive"
                                    label="Inactive"
                                    checked={data.status === 'inactive'}
                                    onChange={() => setData('status', 'inactive')}
                                />
                            </div>
                        </FormField>

                        <FormField className="sm:col-span-2">
                            <Checkbox
                                id="notify"
                                label="Send welcome email"
                                checked={data.notify}
                                onChange={(e) => setData('notify', e.target.checked)}
                            />
                        </FormField>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
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
            </form>
        </AdminLayout>
    );
}
