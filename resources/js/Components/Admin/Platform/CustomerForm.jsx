import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import { Alert, Button, Card, Input, RemoveAction, Select, Textarea } from '@/Components/UI';
import { Link } from '@inertiajs/react';

const emptyAssignment = () => ({ account_id: '', opening_amount: '' });

export default function CustomerForm({
    form,
    onSubmit,
    statuses,
    cancelHref,
    submitLabel,
    accountNumberEditable = false,
    accountOptions = [],
    showAccountAssignments = false,
}) {
    const { data, setData, processing, errors } = form;

    const assignments = data.account_assignments ?? [];

    const selectOptions = accountOptions.map((option) => ({
        value: String(option.id),
        label: `${option.label} (${option.status})`,
    }));

    const setAssignments = (next) => setData('account_assignments', next);

    const updateAssignment = (index, field, value) => {
        const next = [...assignments];
        next[index] = { ...next[index], [field]: value };
        setAssignments(next);
    };

    const addAssignment = () => setAssignments([...assignments, emptyAssignment()]);

    const removeAssignment = (index) => {
        if (assignments.length <= 1) {
            setAssignments([emptyAssignment()]);
            return;
        }
        setAssignments(assignments.filter((_, i) => i !== index));
    };

    const assignmentError =
        errors.account_assignments ||
        Object.keys(errors).find((key) => key.startsWith('account_assignments.'));

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

            {showAccountAssignments && (
                <Card
                    title="Assign accounts"
                    description="Link product accounts to this customer. Opening balance is posted only when an account is newly assigned."
                >
                    {accountOptions.length === 0 ? (
                        <p className="text-sm text-neutral-600">
                            No product accounts exist yet. Create one under Accounts, then assign it here.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {assignments.map((row, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-3 sm:flex-row sm:items-end"
                                    >
                                        <Select
                                            id={`account_assignments_${index}_account_id`}
                                            label={index === 0 ? 'Account' : null}
                                            required
                                            placeholder="Select account"
                                            wrapperClassName="min-w-0 flex-1"
                                            options={selectOptions}
                                            value={row.account_id}
                                            error={errors[`account_assignments.${index}.account_id`]}
                                            onChange={(e) =>
                                                updateAssignment(index, 'account_id', e.target.value)
                                            }
                                        />
                                        <Input
                                            id={`account_assignments_${index}_opening_amount`}
                                            label={index === 0 ? 'Balance' : null}
                                            required
                                            inputMode="decimal"
                                            placeholder="0.00"
                                            wrapperClassName="w-full sm:w-36"
                                            value={row.opening_amount}
                                            error={errors[`account_assignments.${index}.opening_amount`]}
                                            onChange={(e) =>
                                                updateAssignment(index, 'opening_amount', e.target.value)
                                            }
                                        />
                                        <RemoveAction
                                            title="Remove account"
                                            className="mb-0.5 shrink-0"
                                            onClick={() => removeAssignment(index)}
                                        />
                                    </div>
                            ))}

                            <Button type="button" variant="secondary" size="sm" onClick={addAssignment}>
                                + Add account
                            </Button>

                            <p className="text-xs text-neutral-500">
                                Opening balance is deposited only when an account is newly linked to this
                                customer.
                            </p>
                        </div>
                    )}

                    {assignmentError && (
                        <Alert variant="error" className="mt-4">
                            {errors.account_assignments || errors[assignmentError]}
                        </Alert>
                    )}
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
