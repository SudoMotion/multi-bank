import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import { Button, Card, Input, Select } from '@/Components/UI';
import BankWorkspaceLayout from '@/Layouts/Admin/BankWorkspaceLayout';
import { Link, useForm } from '@inertiajs/react';

export default function Edit({ workspace, account, statuses }) {
    const bankId = workspace.bank.id;
    const showHref = route('admin.platform.banks.accounts.show', [bankId, account.id]);

    const { data, setData, put, processing, errors } = useForm({
        name: account.name ?? '',
        status: account.status,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.platform.banks.accounts.update', [bankId, account.id]));
    };

    return (
        <BankWorkspaceLayout
            workspace={workspace}
            title={`Edit ${account.label}`}
            backHref={showHref}
            backLabel="Back to account"
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
                    <Link href={showHref}>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={processing}>
                        Save account
                    </Button>
                </div>
            </AdminForm>
        </BankWorkspaceLayout>
    );
}
