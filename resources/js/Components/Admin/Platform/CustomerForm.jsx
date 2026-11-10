import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import { Alert, Button, Card, Checkbox, Input, Select, Textarea } from '@/Components/UI';
import { Link } from '@inertiajs/react';

export default function CustomerForm({
    form,
    onSubmit,
    statuses,
    cancelHref,
    submitLabel,
    accountNumberEditable = false,
    accountOptions = [],
}) {
    const { data, setData, processing, errors } = form;

    const toggleAccount = (accountId, checked) => {
        const ids = data.account_ids ?? [];
        setData(
            'account_ids',
            checked ? [...ids, accountId] : ids.filter((id) => id !== accountId),
        );
    };

    return (
        <AdminForm onSubmit={onSubmit} className="space-y-4">
            <Card title="Customer Details">
                <AdminFormGrid>
                    {accountNumberEditable && (
                        <Input
                            id="account_number"
                            label="Account number"
                            required
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={16}
                            wrapperClassName="sm:col-span-2 lg:col-span-3 xl:col-span-4"
                            value={data.account_number}
                            error={errors.account_number}
                            onChange={(e) =>
                                setData('account_number', e.target.value.replace(/\D/g, '').slice(0, 16))
                            }
                        />
                    )}
                    {accountNumberEditable && !errors.account_number && (
                        <p className="text-xs text-neutral-500 sm:col-span-2 lg:col-span-3 xl:col-span-4">
                            16 digits, unique across all banks.
                        </p>
                    )}
                    <Input
                        id="first_name"
                        label="First Name"
                        required
                        value={data.first_name}
                        error={errors.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                    />
                    <Input
                        id="last_name"
                        label="Last Name"
                        required
                        value={data.last_name}
                        error={errors.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                    />
                    <Input
                        id="email"
                        label="Email"
                        type="email"
                        value={data.email}
                        error={errors.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <Input
                        id="phone"
                        label="Phone"
                        value={data.phone}
                        error={errors.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                    />
                    <Input
                        id="date_of_birth"
                        label="Date of Birth"
                        type="date"
                        value={data.date_of_birth}
                        error={errors.date_of_birth}
                        onChange={(e) => setData('date_of_birth', e.target.value)}
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
                    <Textarea
                        id="address"
                        label="Address"
                        wrapperClassName="sm:col-span-2 lg:col-span-3 xl:col-span-4"
                        value={data.address}
                        error={errors.address}
                        onChange={(e) => setData('address', e.target.value)}
                    />
                </AdminFormGrid>
            </Card>

            {accountOptions.length > 0 && (
                <Card
                    title="Assign accounts"
                    description="Link deposit products from this bank to this customer."
                >
                    <div className="flex gap-3">
                        {accountOptions.map((option) => (
                            <Checkbox
                                key={option.id}
                                id={`account_${option.id}`}
                                label={`${option.label} (${option.status})`}
                                checked={(data.account_ids ?? []).includes(option.id)}
                                onChange={(e) => toggleAccount(option.id, e.target.checked)}
                            />
                        ))}
                    </div>
                    {errors.account_ids && (
                        <Alert variant="error" className="mt-4">
                            {errors.account_ids}
                        </Alert>
                    )}
                </Card>
            )}

            {accountNumberEditable && accountOptions.length === 0 && (
                <Card title="Assign accounts">
                    <p className="text-sm text-neutral-600">
                        No unassigned accounts are available. Create an account under Accounts first, then return
                        here to assign it.
                    </p>
                </Card>
            )}

            <div className="flex justify-end gap-3">
                <Link href={cancelHref}>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </Link>
                <Button type="submit" disabled={processing}>
                    {submitLabel}
                </Button>
            </div>
        </AdminForm>
    );
}
