import TransactionsTable from '@/Components/Admin/Platform/TransactionsTable';
import { Button, Card, StatCard } from '@/Components/UI';
import { useCan } from '@/hooks/useCan';
import BankWorkspaceLayout from '@/Layouts/Admin/BankWorkspaceLayout';
import { Link } from '@inertiajs/react';

export default function Overview({ workspace, stats, balances, flows, recentTransactions }) {
    const can = useCan();
    const bankId = workspace.bank.id;

    return (
        <BankWorkspaceLayout
            workspace={workspace}
            title="Overview"
            description="Headline numbers for this bank. Everything below is scoped to this bank only."
            actions={
                <div className="flex gap-2">
                    {can('customers.create') && (
                        <Link href={route('admin.platform.banks.customers.create', bankId)}>
                            <Button variant="secondary">New customer</Button>
                        </Link>
                    )}
                    {can('transactions.create') && (
                        <Link href={route('admin.platform.banks.transactions.create', bankId)}>
                            <Button>New transaction</Button>
                        </Link>
                    )}
                </div>
            }
        >
            <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Customers"
                    value={stats.customers}
                    hint={`${stats.active_customers} active`}
                />
                <StatCard
                    label="Open Accounts"
                    value={stats.accounts}
                    hint={stats.frozen_accounts ? `${stats.frozen_accounts} frozen` : 'None frozen'}
                />
                <StatCard label="Transactions (30 days)" value={stats.transactions_30d} />
                <StatCard label="Bank Users" value={stats.users} hint="Admin panel users of this bank" />
            </div>

            <div className="mb-4 grid gap-4 lg:grid-cols-2">
                <Card title="Balances by currency" bodyClassName="p-0">
                    {balances.length === 0 ? (
                        <p className="px-4 py-6 text-sm text-neutral-500">No accounts yet.</p>
                    ) : (
                        <ul className="divide-y divide-neutral-100">
                            {balances.map((row) => (
                                <li key={row.currency} className="flex items-center justify-between px-4 py-3">
                                    <div>
                                        <p className="text-sm font-medium text-neutral-900">{row.currency}</p>
                                        <p className="text-xs text-neutral-500">{row.accounts} accounts</p>
                                    </div>
                                    <p className="text-lg font-semibold tabular-nums text-neutral-900">
                                        {row.total.formatted}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card title="Money in / out (30 days)" bodyClassName="p-0">
                    {flows.length === 0 ? (
                        <p className="px-4 py-6 text-sm text-neutral-500">No activity in the last 30 days.</p>
                    ) : (
                        <ul className="divide-y divide-neutral-100">
                            {flows.map((row) => (
                                <li key={row.currency} className="grid grid-cols-3 items-center px-4 py-3 text-sm">
                                    <span className="font-medium text-neutral-900">{row.currency}</span>
                                    <span className="text-right tabular-nums text-green-700">
                                        +{row.credits.formatted}
                                    </span>
                                    <span className="text-right tabular-nums text-red-600">
                                        −{row.debits.formatted}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>

            <Card
                title="Recent transactions"
                bodyClassName="p-0"
                actions={
                    can('transactions.view') && (
                        <Link
                            href={route('admin.platform.banks.transactions.index', bankId)}
                            className="text-sm text-neutral-600 hover:text-neutral-900"
                        >
                            View all &rarr;
                        </Link>
                    )
                }
            >
                <TransactionsTable bankId={bankId} transactions={recentTransactions} />
            </Card>
        </BankWorkspaceLayout>
    );
}
