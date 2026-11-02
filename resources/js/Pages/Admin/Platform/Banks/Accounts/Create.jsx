import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import { Button, Card, Input, Select } from '@/Components/UI';
import BankWorkspaceLayout from '@/Layouts/Admin/BankWorkspaceLayout';
import { Link, useForm } from '@inertiajs/react';

export default function Create({ workspace, customers, types, currencies, defaults }) {
    const bankId = workspace.bank.id;
    const backHref = defaults.customer_id
        ? route('admin.platform.banks.customers.show', [bankId, defaults.customer_id])
        : route('admin.platform.banks.accounts.index', bankId);

    const { data, setData, post, processing, errors } = useForm({
        customer_id: defaults.customer_id,
        type: types[0]?.value ?? '',
        currency: defaults.currency,
        initial_deposit: '',
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
            backLabel="Back"
        >
            <AdminForm onSubmit={submit} className="space-y-4">
                <Card title="Account Details">
                    <AdminFormGrid>
                        <Select
                            id="customer_id"
                            label="Customer"
                            required
                            wrapperClassName="sm:col-span-2"
                            placeholder={customers.length ? 'Select a customer' : 'No active customers'}
                            options={customers}
                            value={data.customer_id}
                            error={errors.customer_id}
                            onChange={(e) => setData('customer_id', e.target.value)}
                        />
                        <Select
                            id="type"
                            label="Type"
                            required
                            placeholder={null}
                            options={types}
                            value={data.type}
                            error={errors.type}
                            onChange={(e) => setData('type', e.target.value)}
                        />
                        <Select
                            id="currency"
                            label="Currency"
                            required
                            placeholder={null}
                            options={currencies}
                            value={data.currency}
                            error={errors.currency}
                            onChange={(e) => setData('currency', e.target.value)}
                        />
                        <Input
                            id="initial_deposit"
                            label="Initial Deposit"
                            inputMode="decimal"
                            placeholder="0.00"
                            value={data.initial_deposit}
                            error={errors.initial_deposit}
                            onChange={(e) => setData('initial_deposit', e.target.value)}
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
                        Open account
                    </Button>
                </div>
            </AdminForm>
        </BankWorkspaceLayout>
    );
}
