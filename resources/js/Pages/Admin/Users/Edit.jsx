import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
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

export default function Edit({ userId }) {
    const { data, setData, processing, errors } = useForm({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'editor',
        status: 'active',
        notify: false,
    });

    const submit = (e) => {
        e.preventDefault();
    };

    return (
        <AdminLayout title="Edit User">
            <Head title="Edit User" />

            <AdminPageHeader
                title={`Edit User #${userId}`}
                backHref={route('admin.users.index')}
                backLabel="Back to users"
            />

            <AdminForm onSubmit={submit}>
                <Card title="User Details">
                    <AdminFormGrid>
                        <Input
                            id="name"
                            label="Name"
                            wrapperClassName="sm:col-span-2"
                            value={data.name}
                            error={errors.name}
                            required
                            onChange={(e) => setData('name', e.target.value)}
                        />

                        <Input
                            id="email"
                            label="Email"
                            wrapperClassName="sm:col-span-2"
                            type="email"
                            value={data.email}
                            error={errors.email}
                            required
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <Select
                            id="role"
                            label="Role"
                            value={data.role}
                            error={errors.role}
                            options={[
                                { value: 'administrator', label: 'Administrator' },
                                { value: 'editor', label: 'Editor' },
                                { value: 'viewer', label: 'Viewer' },
                            ]}
                            onChange={(e) => setData('role', e.target.value)}
                        />

                        <FormField label="Status" error={errors.status}>
                            <div className="flex flex-wrap gap-4 pt-1">
                                <Radio
                                    id="edit_user_status_active"
                                    name="status"
                                    value="active"
                                    label="Active"
                                    checked={data.status === 'active'}
                                    onChange={() => setData('status', 'active')}
                                />
                                <Radio
                                    id="edit_user_status_inactive"
                                    name="status"
                                    value="inactive"
                                    label="Inactive"
                                    checked={data.status === 'inactive'}
                                    onChange={() => setData('status', 'inactive')}
                                />
                            </div>
                        </FormField>

                        <div className="sm:col-span-2">
                            <Checkbox
                                id="notify"
                                label="Send update notification"
                                checked={data.notify}
                                onChange={(e) => setData('notify', e.target.checked)}
                            />
                        </div>
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
