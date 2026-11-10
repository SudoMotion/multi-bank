import AccountList from '@/Components/Customer/AccountList';
import CustomerLayout from '@/Layouts/Customer/CustomerLayout';
import { Alert } from '@/Components/UI';
import { Head, usePage } from '@inertiajs/react';

export default function Index({ accounts, currencyTotals }) {
    const { flash } = usePage().props;

    return (
        <CustomerLayout
            current="accounts"
            title="Accounts"
            contentClassName="w-full"
        >
            <Head title="Accounts summary" />

            {flash?.success && (
                <Alert variant="success" className="mb-5">
                    {flash.success}
                </Alert>
            )}

            <AccountList
                accounts={accounts}
                sectionTitle="Bank Accounts"
                currencyTotals={currencyTotals}
            />
        </CustomerLayout>
    );
}
