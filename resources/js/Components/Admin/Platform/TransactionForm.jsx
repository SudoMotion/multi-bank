import { AdminForm } from '@/Components/Admin/AdminForm';
import { Button, Input, Select, cn } from '@/Components/UI';
import { useForm } from '@inertiajs/react';

const operationHints = {
    deposit: 'Adds funds to the account.',
    withdrawal: 'Removes funds. Overdrafts are not allowed.',
    transfer: 'Moves funds to another account of this bank in the same currency.',
    adjustment: 'Administrative correction. A reason is required and is kept in the ledger.',
};

/**
 * Posts deposits, withdrawals, transfers and adjustments for one bank.
 * Pass `accountId` to lock the source account (account page), or `accounts`
 * to let the user pick it.
 */
export default function TransactionForm({
    bankId,
    operations,
    accounts = [],
    accountId = null,
    transferTargets = null,
    defaults = {},
    maxAmount,
    stay = false,
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        operation: defaults.operation ?? 'deposit',
        account_id: accountId ?? defaults.account_id ?? '',
        to_account_id: '',
        direction: 'credit',
        amount: '',
        description: '',
        stay,
    });

    const source = accounts.find((account) => String(account.value) === String(data.account_id));
    const targets =
        transferTargets ??
        accounts.filter(
            (account) =>
                String(account.value) !== String(data.account_id) &&
                account.status === 'active' &&
                (!source || account.currency === source.currency),
        );

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.platform.banks.transactions.store', bankId), {
            preserveScroll: true,
            onSuccess: () => reset('amount', 'description', 'to_account_id'),
        });
    };

    return (
        <AdminForm onSubmit={submit} className="space-y-4">
            <div className="flex flex-wrap gap-1 rounded-md bg-neutral-100 p-1">
                {operations.map((operation) => (
                    <button
                        key={operation.value}
                        type="button"
                        onClick={() => setData('operation', operation.value)}
                        className={cn(
                            'flex-1 rounded px-3 py-1.5 text-sm font-medium transition',
                            data.operation === operation.value
                                ? 'bg-white text-neutral-900 shadow-sm'
                                : 'text-neutral-600 hover:text-neutral-900',
                        )}
                    >
                        {operation.label}
                    </button>
                ))}
            </div>
            <p className="text-xs text-neutral-500">{operationHints[data.operation]}</p>

            {accountId === null && (
                <div>
                    <Select
                        id="account_id"
                        label={data.operation === 'transfer' ? 'From account' : 'Account'}
                        required
                        placeholder="Select an account"
                        options={accounts}
                        value={data.account_id}
                        error={errors.account_id}
                        onChange={(e) => setData('account_id', e.target.value)}
                    />
                    {source && (
                        <p className="mt-1.5 text-xs text-neutral-500">
                            Balance {source.balance}
                            {source.status !== 'active' && ` · ${source.status}`}
                        </p>
                    )}
                </div>
            )}

            {data.operation === 'transfer' && (
                <Select
                    id="to_account_id"
                    label="To account"
                    required
                    placeholder={targets.length ? 'Select an account' : 'No eligible accounts'}
                    options={targets}
                    value={data.to_account_id}
                    error={errors.to_account_id}
                    onChange={(e) => setData('to_account_id', e.target.value)}
                />
            )}

            {data.operation === 'adjustment' && (
                <Select
                    id="direction"
                    label="Direction"
                    required
                    placeholder={null}
                    options={[
                        { value: 'credit', label: 'Credit (increase balance)' },
                        { value: 'debit', label: 'Debit (decrease balance)' },
                    ]}
                    value={data.direction}
                    error={errors.direction}
                    onChange={(e) => setData('direction', e.target.value)}
                />
            )}

            <div>
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
                {!errors.amount && maxAmount && (
                    <p className="mt-1.5 text-xs text-neutral-500">Platform limit: {maxAmount} per transaction.</p>
                )}
            </div>

            <Input
                id="description"
                label={data.operation === 'adjustment' ? 'Reason' : 'Description'}
                required={data.operation === 'adjustment'}
                value={data.description}
                error={errors.description}
                onChange={(e) => setData('description', e.target.value)}
            />

            <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                    Post {operations.find((operation) => operation.value === data.operation)?.label.toLowerCase()}
                </Button>
            </div>
        </AdminForm>
    );
}
