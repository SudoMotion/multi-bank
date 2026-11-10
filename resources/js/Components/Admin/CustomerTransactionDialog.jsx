import Modal from '@/Components/Modal';
import { Alert, Button, Input, Select, Textarea } from '@/Components/UI';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function CustomerTransactionDialog({
    customer,
    bankId,
    transactionTypes,
    transactionStatuses,
    onClose,
}) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        account_id: '',
        type: 'deposit',
        amount: '',
        status: 'complete',
        description: '',
    });

    useEffect(() => {
        if (!customer) {
            reset();
            clearErrors();
            return;
        }

        const firstAccount = customer.accounts?.[0];
        setData({
            account_id: firstAccount ? String(firstAccount.id) : '',
            type: 'deposit',
            amount: '',
            status: 'complete',
            description: '',
        });
        clearErrors();
    }, [customer, reset, clearErrors, setData]);

    const close = () => {
        reset();
        clearErrors();
        onClose();
    };

    const submit = (e) => {
        e.preventDefault();
        if (!customer) {
            return;
        }

        post(route('admin.platform.banks.customers.transactions.store', [bankId, customer.id]), {
            preserveScroll: true,
            onSuccess: close,
        });
    };

    const accountOptions = (customer?.accounts ?? []).map((account) => ({
        value: String(account.id),
        label: `${account.label} — ${account.balance.formatted} (${account.status})`,
    }));

    const noAccounts = customer && accountOptions.length === 0;

    return (
        <Modal show={Boolean(customer)} maxWidth="md" onClose={close}>
            {customer && (
                <form onSubmit={submit} className="p-5">
                    <h3 className="text-lg font-medium text-neutral-900">Transaction</h3>
                    <p className="mt-1 text-sm text-neutral-600">
                        Post to an account for <span className="font-medium">{customer.name}</span>. Balances
                        update only when status is <span className="font-medium">Complete</span>.
                    </p>

                    {noAccounts ? (
                        <Alert variant="warning" className="mt-4">
                            This customer has no accounts. Assign or open an account first.
                        </Alert>
                    ) : (
                        <div className="mt-4 space-y-4">
                            <Select
                                id="account_id"
                                label="Account"
                                required
                                placeholder={null}
                                options={accountOptions}
                                value={data.account_id}
                                error={errors.account_id}
                                onChange={(e) => setData('account_id', e.target.value)}
                            />
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
                            <Textarea
                                id="description"
                                label="Description"
                                value={data.description}
                                error={errors.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </div>
                    )}

                    <div className="mt-5 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={close}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing || noAccounts}>
                            Save transaction
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
