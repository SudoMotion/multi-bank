import CustomerForm from '@/Components/Admin/Platform/CustomerForm';
import BankWorkspaceLayout from '@/Layouts/Admin/BankWorkspaceLayout';
import { useForm } from '@inertiajs/react';

export default function Edit({ workspace, customer, statuses }) {
    const bankId = workspace.bank.id;
    const showHref = route('admin.platform.banks.customers.show', [bankId, customer.id]);

    const form = useForm({
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email ?? '',
        phone: customer.phone ?? '',
        date_of_birth: customer.date_of_birth ?? '',
        address: customer.address ?? '',
        status: customer.status,
    });

    const submit = (e) => {
        e.preventDefault();
        form.put(route('admin.platform.banks.customers.update', [bankId, customer.id]));
    };

    return (
        <BankWorkspaceLayout
            workspace={workspace}
            title={`Edit ${customer.name}`}
            backHref={showHref}
            backLabel="Back to customer"
        >
            <CustomerForm
                form={form}
                onSubmit={submit}
                statuses={statuses}
                cancelHref={showHref}
                submitLabel="Save customer"
            />
        </BankWorkspaceLayout>
    );
}
