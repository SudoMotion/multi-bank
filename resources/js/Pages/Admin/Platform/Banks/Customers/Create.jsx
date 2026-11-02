import CustomerForm from '@/Components/Admin/Platform/CustomerForm';
import BankWorkspaceLayout from '@/Layouts/Admin/BankWorkspaceLayout';
import { useForm } from '@inertiajs/react';

export default function Create({ workspace, statuses }) {
    const bankId = workspace.bank.id;

    const form = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        address: '',
        status: 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('admin.platform.banks.customers.store', bankId));
    };

    return (
        <BankWorkspaceLayout
            workspace={workspace}
            title="New customer"
            backHref={route('admin.platform.banks.customers.index', bankId)}
            backLabel="Back to customers"
        >
            <CustomerForm
                form={form}
                onSubmit={submit}
                statuses={statuses}
                cancelHref={route('admin.platform.banks.customers.index', bankId)}
                submitLabel="Create customer"
            />
        </BankWorkspaceLayout>
    );
}
