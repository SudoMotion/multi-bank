import Modal from '@/Components/Modal';
import { Button } from '@/Components/UI';
import { useForm } from '@inertiajs/react';

export default function DeleteCustomerDialog({ customer, bankId, onClose }) {
    const { delete: destroy, processing } = useForm({});

    const close = () => {
        onClose();
    };

    const submit = (e) => {
        e.preventDefault();
        if (!customer) {
            return;
        }

        destroy(route('admin.platform.banks.customers.destroy', [bankId, customer.id]), {
            preserveScroll: true,
            onSuccess: close,
        });
    };

    const linkedAccounts = customer?.accounts_count ?? 0;

    return (
        <Modal show={Boolean(customer)} maxWidth="md" onClose={close}>
            {customer && (
                <form onSubmit={submit} className="p-5">
                    <h3 className="text-lg font-medium text-neutral-900">Delete {customer.name}?</h3>
                    <p className="mt-2 text-sm text-neutral-600">
                        Account number <span className="font-mono">{customer.account_number}</span> will be
                        permanently removed. This cannot be undone.
                    </p>

                    {linkedAccounts > 0 ? (
                        <p className="mt-4 rounded-md bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
                            This customer is linked to {linkedAccounts}{' '}
                            {linkedAccounts === 1 ? 'product account' : 'product accounts'}. Those accounts will
                            stay open; only this customer’s access is removed.
                        </p>
                    ) : null}

                    <div className="mt-5 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={close}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="danger" disabled={processing}>
                            Delete customer
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
