import TransactionList from '@/Components/Customer/TransactionList';
import CustomerLayout from '@/Layouts/Customer/CustomerLayout';
import { Alert } from '@/Components/UI';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ transactions, accountFilter }) {
    const { flash } = usePage().props;

    const sectionTitle = accountFilter?.name
        ? `${accountFilter.name} activity`
        : 'Account activity';

    return (
        <CustomerLayout
            current="transactions"
            title="Transactions"
            contentClassName="w-full"
        >
            <Head title={accountFilter?.name ? `Transactions — ${accountFilter.name}` : 'Account activity'} />

            {flash?.success && (
                <Alert variant="success" className="mb-5">
                    {flash.success}
                </Alert>
            )}

            {accountFilter && (
                <p className="mb-4 text-base text-neutral-600">
                    Showing transactions for{' '}
                    <span className="font-medium text-neutral-900">{accountFilter.name}</span>.{' '}
                    <Link
                        href={route('customer.transactions')}
                        className="font-medium text-[#006ac3] hover:underline"
                    >
                        View all accounts
                    </Link>
                </p>
            )}

            <TransactionList
                transactions={transactions}
                sectionTitle={sectionTitle}
                accountFilter={accountFilter}
            />
        </CustomerLayout>
    );
}
