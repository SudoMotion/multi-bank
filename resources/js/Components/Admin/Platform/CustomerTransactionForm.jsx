import { AdminForm } from '@/Components/Admin/AdminForm';
import { Button, Input, Select, Textarea } from '@/Components/UI';
import { useForm } from '@inertiajs/react';

export default function CustomerTransactionForm({
    accounts,
    transactionTypes,
    transactionStatuses,
    submitUrl,
    defaults = {},
    returnTo = 'transactions',
    customerId = '',
}) {
    const { data, setData, post, processing, errors } = useForm({
        account_id: defaults.account_id ?? '',
        type: defaults.type ?? 'deposit',
        amount: defaults.amount ?? '',
        status: defaults.status ?? 'complete',
        description: defaults.description ?? '',
        return: returnTo,
        customer_id: customerId || '',
    });

    const source = accounts.find((account) => String(account.value) === String(data.account_id));

    const submit = (e) => {
        e.preventDefault();
        post(submitUrl);
    };

    return (
        <AdminForm onSubmit={submit} className="space-y-4">
            <Select
                id="account_id"
                label="Account"
                required
                placeholder="Select an account"
                options={accounts}
                value={data.account_id}
                error={errors.account_id}
                onChange={(e) => setData('account_id', e.target.value)}
            />
            {source && (
                <p className="-mt-2 text-xs text-neutral-500">
                    Balance {source.balance}
                    {source.status !== 'active' && ` · ${source.status}`}
                </p>
            )}
            <Select
                id="type"
                label="Transaction type"
                required
                placeholder={null}
                options={transactionTypes}
                value={data.type}
                error={errors.type}
                onChange={(e) => setData('type', e.target.value)}
            />
            <Input
                id="amount"
                label="Amount"
                required
                inputMode="decimal"
                placeholder="0.00"
                value={data.amount}
                error={errors.amount}
                onChange={(e) => setData('amount', e.target.value)}
            />
            <Select
                id="status"
                label="Status"
                required
                placeholder={null}
                options={transactionStatuses}
                value={data.status}
                error={errors.status}
                onChange={(e) => setData('status', e.target.value)}
            />
            <p className="-mt-2 text-xs text-neutral-500">
                Account balance updates only when status is <span className="font-medium">Complete</span>.
            </p>
            <Textarea
                id="description"
                label="Description"
                value={data.description}
                error={errors.description}
                onChange={(e) => setData('description', e.target.value)}
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                    Save transaction
                </Button>
            </div>
        </AdminForm>
    );
}
