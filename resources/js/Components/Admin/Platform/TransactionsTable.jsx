import { StatusBadge, Table, Td, Th, cn } from '@/Components/UI';
import { Link } from '@inertiajs/react';

export default function TransactionsTable({ bankId, transactions, showAccount = true, empty = 'No transactions yet.' }) {
    return (
        <Table
            isEmpty={transactions.length === 0}
            empty={empty}
            head={
                <>
                    <Th>Date</Th>
                    <Th>Type</Th>
                    <Th>Status</Th>
                    {showAccount && <Th>Account</Th>}
                    <Th>Description</Th>
                    <Th align="right">Amount</Th>
                    <Th align="right">Balance</Th>
                </>
            }
        >
            {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-neutral-50/50">
                    <Td>
                        <p className="text-neutral-800">{transaction.created_at_label}</p>
                        <p className="font-mono text-xs text-neutral-400" title={transaction.reference}>
                            {transaction.reference.slice(-10)}
                        </p>
                    </Td>
                    <Td>
                        <p className="text-neutral-800">{transaction.type_label}</p>
                        {transaction.related_account && (
                            <p className="text-xs text-neutral-500">
                                {transaction.amount.minor < 0 ? 'to' : 'from'} {transaction.related_account}
                            </p>
                        )}
                    </Td>
                    <Td>
                        <StatusBadge status={transaction.status} label={transaction.status_label} />
                    </Td>
                    {showAccount && (
                        <Td>
                            {transaction.account ? (
                                <Link
                                    href={route('admin.platform.banks.accounts.show', [bankId, transaction.account.id])}
                                    className="hover:underline"
                                >
                                    <p className="text-neutral-800">{transaction.account.label}</p>
                                    <p className="text-xs font-mono text-neutral-500">
                                        {transaction.account.account_number} · {transaction.account.customer}
                                    </p>
                                </Link>
                            ) : (
                                '—'
                            )}
                        </Td>
                    )}
                    <Td className="max-w-xs truncate whitespace-normal">
                        {transaction.description ?? <span className="text-neutral-400">—</span>}
                        {transaction.created_by && (
                            <p className="text-xs text-neutral-400">by {transaction.created_by}</p>
                        )}
                    </Td>
                    <Td
                        align="right"
                        className={cn(
                            'font-medium tabular-nums',
                            transaction.amount.minor < 0 ? 'text-red-600' : 'text-green-700',
                        )}
                    >
                        {transaction.amount.minor > 0 ? '+' : ''}
                        {transaction.amount.formatted}
                    </Td>
                    <Td align="right" className="tabular-nums text-neutral-800">
                        {transaction.balance_after.formatted}
                    </Td>
                </tr>
            ))}
        </Table>
    );
}
