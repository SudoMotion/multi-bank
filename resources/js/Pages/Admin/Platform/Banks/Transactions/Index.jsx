import FilterBar from '@/Components/Admin/FilterBar';
import TransactionsTable from '@/Components/Admin/Platform/TransactionsTable';
import { Button, Card, Pagination } from '@/Components/UI';
import BankWorkspaceLayout from '@/Layouts/Admin/BankWorkspaceLayout';
import { Link } from '@inertiajs/react';

export default function Index({ workspace, transactions, filters, types, can }) {
    const bankId = workspace.bank.id;

    return (
        <BankWorkspaceLayout
            workspace={workspace}
            title="Transactions"
            description="The ledger of this bank. Entries are immutable; corrections are posted as adjustments."
            actions={
                can.create ? (
                    <Link href={route('admin.platform.banks.transactions.create', bankId)}>
                        <Button>New transaction</Button>
                    </Link>
                ) : null
            }
        >
            <Card bodyClassName="p-0">
                <FilterBar
                    url={route('admin.platform.banks.transactions.index', bankId)}
                    filters={filters}
                    fields={[
                        { name: 'search', label: 'Search', placeholder: 'Reference, account, customer' },
                        { name: 'type', label: 'Type', type: 'select', options: types },
                        { name: 'from', label: 'From', type: 'date' },
                        { name: 'to', label: 'To', type: 'date' },
                    ]}
                />

                <TransactionsTable
                    bankId={bankId}
                    transactions={transactions.data}
                    empty="No transactions match."
                />
                <Pagination paginator={transactions} />
            </Card>
        </BankWorkspaceLayout>
    );
}
