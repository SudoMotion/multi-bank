import Modal from '@/Components/Modal';
import { Button } from '@/Components/UI';
import { useForm } from '@inertiajs/react';

export default function DeleteAccountDialog({ account, bankId, onClose }) {
    const { delete: destroy, processing } = useForm({});

    const close = () => {
        onClose();
    };

    const submit = (e) => {
        e.preventDefault();
        if (!account || account.balance_minor !== 0 || (account.transactions_count ?? 0) > 0) {
            return;
        }

        destroy(route('admin.platform.banks.accounts.destroy', [bankId, account.id]), {
            preserveScroll: true,
            onSuccess: close,
        });
    };

    const hasBalance = (account?.balance_minor ?? 0) !== 0;
    const hasHistory = (account?.transactions_count ?? 0) > 0;
    const blocked = hasBalance || hasHistory;

    return (
        <Modal show={Boolean(account)} maxWidth="md" onClose={close}>
            {account && (
                <form onSubmit={submit} className="p-5">
                    <h3 className="text-lg font-medium text-neutral-900">Delete {account.label}?</h3>
                    <p className="mt-2 text-sm text-neutral-600">
                        This permanently removes the account record. This cannot be undone.
                    </p>

                    {hasBalance ? (
                        <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
                            Balance must be {account.balance.formatted} → 0.00 before deletion.
                        </p>
                    ) : null}

                    {hasHistory ? (
                        <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
                            This account has {account.transactions_count} transaction
                            {account.transactions_count === 1 ? '' : 's'} and cannot be deleted.
                        </p>
                    ) : null}

                    <div className="mt-5 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={close}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="danger" disabled={blocked || processing}>
                            Delete account
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
