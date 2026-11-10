import Modal from '@/Components/Modal';
import { Button, Input } from '@/Components/UI';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function ChangeCustomerPasswordDialog({ customer, bankId, onClose }) {
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (!customer) {
            reset();
            clearErrors();
        }
    }, [customer, reset, clearErrors]);

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

        put(route('admin.platform.banks.customers.password.update', [bankId, customer.id]), {
            preserveScroll: true,
            onSuccess: close,
        });
    };

    return (
        <Modal show={Boolean(customer)} maxWidth="md" onClose={close}>
            {customer && (
                <form onSubmit={submit} className="p-5">
                    <h3 className="text-lg font-medium text-neutral-900">Change password</h3>
                    <p className="mt-1 text-sm text-neutral-600">
                        Set a new online banking password for <span className="font-medium">{customer.name}</span>.
                    </p>

                    <div className="mt-4 space-y-4">
                        <Input
                            id="password"
                            label="New password"
                            type="password"
                            required
                            autoComplete="new-password"
                            value={data.password}
                            error={errors.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <Input
                            id="password_confirmation"
                            label="Confirm password"
                            type="password"
                            required
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            error={errors.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                    </div>

                    <div className="mt-5 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={close}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Save password
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
