import TransactionForm from '@/Components/Admin/Platform/TransactionForm';
import TransactionsTable from '@/Components/Admin/Platform/TransactionsTable';
import { Alert, Button, Card, Pagination, StatusBadge } from '@/Components/UI';
import BankWorkspaceLayout from '@/Layouts/Admin/BankWorkspaceLayout';
import { Link, router, usePage } from '@inertiajs/react';

function StatusActions({ bankId, account }) {
    const changeStatus = (status, question) => {
        if (!question || confirm(question)) {
            router.patch(
                route('admin.platform.banks.accounts.status', [bankId, account.id]),
                { status },
                { preserveScroll: true },
            );
        }
    };

    if (account.status === 'closed') {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {account.status === 'active' ? (
                <Button variant="secondary" size="sm" onClick={() => changeStatus('frozen')}>
                    Freeze
                </Button>
            ) : (
                <Button variant="secondary" size="sm" onClick={() => changeStatus('active')}>
                    Unfreeze
                </Button>
            )}
            <Button
                variant="secondary"
                size="sm"
                className="text-red-600"
                disabled={account.balance.minor !== 0}
                title={account.balance.minor !== 0 ? 'Balance must be zero to close' : undefined}
                onClick={() => changeStatus('closed', `Close account ${account.account_number}? Closed accounts cannot be reopened.`)}
            >
                Close account
            </Button>
        </div>
    );
}

export default function Show({ workspace, account, transactions, transferTargets, operations, maxAmount, can }) {
    const bankId = workspace.bank.id;
    const { errors } = usePage().props;

    return (
        <BankWorkspaceLayout
            workspace={workspace}
            title={`${account.type_label} ${account.account_number}`}
            description={account.customer ? `Held by ${account.customer.name}` : null}
            backHref={route('admin.platform.banks.accounts.index', bankId)}
            backLabel="Back to accounts"
        >
            {errors.status && <Alert variant="error">{errors.status}</Alert>}

            <div className="mb-4 grid gap-4 lg:grid-cols-3">
                <Card title="Summary" className="lg:col-span-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Balance</p>
                    <p className="mt-1 text-3xl font-semibold tabular-nums text-neutral-900">
                        {account.balance.formatted}
                    </p>

                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <dt className="text-xs text-neutral-500">Status</dt>
                            <dd className="mt-0.5">
                                <StatusBadge status={account.status} />
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-neutral-500">Currency</dt>
                            <dd className="mt-0.5 text-neutral-900">{account.currency}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-neutral-500">Opened</dt>
                            <dd className="mt-0.5 text-neutral-900">{account.opened_at}</dd>
                        </div>
                        {account.closed_at && (
                            <div>
                                <dt className="text-xs text-neutral-500">Closed</dt>
                                <dd className="mt-0.5 text-neutral-900">{account.closed_at}</dd>
                            </div>
                        )}
                        {account.customer && (
                            <div className="col-span-2">
                                <dt className="text-xs text-neutral-500">Customer</dt>
                                <dd className="mt-0.5">
                                    <Link
                                        href={route('admin.platform.banks.customers.show', [bankId, account.customer.id])}
                                        className="text-neutral-900 hover:underline"
                                    >
                                        {account.customer.name} ({account.customer.customer_number})
                                    </Link>
                                </dd>
                            </div>
                        )}
                    </dl>

                    {can.edit && (
                        <div className="mt-4 border-t border-neutral-100 pt-4">
                            <StatusActions bankId={bankId} account={account} />
                        </div>
                    )}
                </Card>

                <Card title="Post a transaction" className="lg:col-span-2">
                    {!can.transact ? (
                        <p className="text-sm text-neutral-500">You cannot post transactions.</p>
                    ) : account.status === 'closed' ? (
                        <p className="text-sm text-neutral-500">This account is closed.</p>
                    ) : (
                        <TransactionForm
                            bankId={bankId}
                            operations={
                                account.status === 'active'
                                    ? operations
                                    : operations.filter((operation) => operation.value === 'adjustment')
                            }
                            accountId={account.id}
                            transferTargets={transferTargets}
                            defaults={{ operation: account.status === 'active' ? 'deposit' : 'adjustment' }}
                            maxAmount={maxAmount}
                            stay
                        />
                    )}
                </Card>
            </div>

            <Card title="Transaction history" bodyClassName="p-0">
                <TransactionsTable bankId={bankId} transactions={transactions.data} showAccount={false} />
                <Pagination paginator={transactions} />
            </Card>
        </BankWorkspaceLayout>
    );
}
