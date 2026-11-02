import Modal from '@/Components/Modal';
import { Button, Input } from '@/Components/UI';
import { useForm } from '@inertiajs/react';

export default function DeleteBankDialog({ bank, onClose }) {
    const { data, setData, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        confirm: '',
    });

    const close = () => {
        reset();
        clearErrors();
        onClose();
    };

    const submit = (e) => {
        e.preventDefault();
        destroy(route('admin.tenants.destroy', bank.id), {
            preserveScroll: true,
            onSuccess: close,
        });
    };

    return (
        <Modal show={Boolean(bank)} maxWidth="md" onClose={close}>
            {bank && (
                <form onSubmit={submit} className="p-5">
                    <h3 className="text-lg font-medium text-neutral-900">Delete {bank.name}?</h3>
                    <p className="mt-2 text-sm text-neutral-600">
                        This permanently deletes the bank and all of its users, customers ({bank.customers_count}),
                        accounts ({bank.accounts_count}), transactions, settings and uploaded files. This cannot be
                        undone.
                    </p>

                    {bank.is_active ? (
                        <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
                            Deactivate the bank first. Active banks cannot be deleted.
                        </p>
                    ) : (
                        <Input
                            id="confirm_slug"
                            wrapperClassName="mt-4"
                            label={`Type "${bank.slug}" to confirm`}
                            autoComplete="off"
                            value={data.confirm}
                            error={errors.confirm}
                            onChange={(e) => setData('confirm', e.target.value)}
                        />
                    )}

                    <div className="mt-5 flex justify-end gap-3">
                        <Button variant="secondary" onClick={close}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="danger"
                            disabled={bank.is_active || processing || data.confirm !== bank.slug}
                        >
                            Delete bank
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
