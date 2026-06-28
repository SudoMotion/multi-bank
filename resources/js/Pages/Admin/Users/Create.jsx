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
                            placeholder="Select role"
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

                        <div className="sm:col-span-2">
                            <Checkbox
                                id="notify"
                                label="Send welcome email"
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
                            Save User
                        </Button>
                    </div>
                </Card>
            </AdminForm>
        </AdminLayout>
    );
}
