import FilterBar from '@/Components/Admin/FilterBar';
import TransactionsTable from '@/Components/Admin/Platform/TransactionsTable';
import { Button, Card, Pagination } from '@/Components/UI';
import BankWorkspaceLayout from '@/Layouts/Admin/BankWorkspaceLayout';
import { Link } from '@inertiajs/react';

export default function Transactions({
    workspace,
    customer,
    transactions,
    filters,
    types,
    statuses,
    accounts_count,
    can,
}) {
    const bankId = workspace.bank.id;
    const listUrl = route('admin.platform.banks.customers.transactions.index', [bankId, customer.id]);
    const createHref = route('admin.platform.banks.transactions.create', {
        tenant: bankId,
        customer: customer.id,
    });

    return (
        <BankWorkspaceLayout
            workspace={workspace}
            title={`Transactions — ${customer.name}`}
            description={`Account ${customer.account_number} · all ledger activity across this customer’s product accounts.`}
            backHref={route('admin.platform.banks.customers.show', [bankId, customer.id])}
            backLabel="Back to customer"
            actions={
                can.transact ? (
                    <Link href={createHref}>
                        <Button disabled={accounts_count === 0}>New transaction</Button>
                    </Link>
                ) : null
            }
        >
            <Card bodyClassName="p-0">
                {accounts_count === 0 && can.transact && (
                    <p className="border-b border-neutral-100 px-4 py-3 text-sm text-amber-800 bg-amber-50">
                        This customer has no accounts yet. Open or assign an account before posting transactions.
                    </p>
                )}
                <FilterBar
                    url={listUrl}
                    filters={filters}
                    fields={[
                        { name: 'search', label: 'Search', placeholder: 'Reference or description' },
                        { name: 'type', label: 'Type', type: 'select', options: types },
                        { name: 'status', label: 'Status', type: 'select', options: statuses },
                        { name: 'from', label: 'From', type: 'date' },
                        { name: 'to', label: 'To', type: 'date' },
                    ]}
                />

                <TransactionsTable
                    bankId={bankId}
                    transactions={transactions.data}
                    empty="No transactions for this customer yet."
                />
                <Pagination paginator={transactions} />
            </Card>
        </BankWorkspaceLayout>
    );
}
