import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import { Button, Card, Input, Select } from '@/Components/UI';
import BankWorkspaceLayout from '@/Layouts/Admin/BankWorkspaceLayout';
import { Link, useForm } from '@inertiajs/react';

export default function Create({ workspace, statuses, defaultStatus }) {
    const bankId = workspace.bank.id;
    const backHref = route('admin.platform.banks.accounts.index', bankId);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        status: defaultStatus,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.platform.banks.accounts.store', bankId));
    };

    return (
        <BankWorkspaceLayout
            workspace={workspace}
            title="Open account"
            backHref={backHref}
            backLabel="Back to accounts"
        >
            <AdminForm onSubmit={submit} className="space-y-4">
                <Card title="Account details">
                    <AdminFormGrid>
                        <Input
                            id="name"
                            label="Account name"
                            required
                            wrapperClassName="sm:col-span-2"
                            value={data.name}
                            error={errors.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <Select
                            id="status"
                            label="Status"
                            required
                            placeholder={null}
                            options={statuses}
                            value={data.status}
                            error={errors.status}
                            onChange={(e) => setData('status', e.target.value)}
                        />
                    </AdminFormGrid>
                </Card>

                <div className="flex justify-end gap-3">
                    <Link href={backHref}>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={processing}>
                        Create account
                    </Button>
                </div>
            </AdminForm>
        </BankWorkspaceLayout>
    );
}
