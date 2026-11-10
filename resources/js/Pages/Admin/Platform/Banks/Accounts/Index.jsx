import DeleteAccountDialog from '@/Components/Admin/DeleteAccountDialog';
import FilterBar from '@/Components/Admin/FilterBar';
import {
    ActionButtonGroup,
    Button,
    Card,
    DeleteAction,
    EditAction,
    Pagination,
    StatusBadge,
    Table,
    Td,
    Th,
    ViewAction,
} from '@/Components/UI';
import BankWorkspaceLayout from '@/Layouts/Admin/BankWorkspaceLayout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ workspace, accounts, filters, statuses, types, can }) {
    const bankId = workspace.bank.id;
    const [deleting, setDeleting] = useState(null);

    return (
        <BankWorkspaceLayout
            workspace={workspace}
            title="Accounts"
            description="Every deposit account held at this bank."
            actions={
                can.create ? (
                    <Link href={route('admin.platform.banks.accounts.create', bankId)}>
                        <Button>Open account</Button>
                    </Link>
                ) : null
            }
        >
            <Card bodyClassName="p-0">
                <FilterBar
                    url={route('admin.platform.banks.accounts.index', bankId)}
                    filters={filters}
                    fields={[
                        { name: 'search', label: 'Search', placeholder: 'Account number or customer name' },
                        { name: 'type', label: 'Type', type: 'select', options: types },
                        { name: 'status', label: 'Status', type: 'select', options: statuses },
                    ]}
                />

                <Table
                    isEmpty={accounts.data.length === 0}
                    empty="No accounts match."
                    head={
                        <>
                            <Th>Product</Th>
                            <Th>Customers</Th>
                            <Th>Type</Th>
                            <Th>Status</Th>
                            <Th align="right">Balance</Th>
                            <Th align="right">Actions</Th>
                        </>
                    }
                >
                    {accounts.data.map((account) => (
                        <tr key={account.id} className="hover:bg-neutral-50/50">
                            <Td>
                                <Link
                                    href={route('admin.platform.banks.accounts.show', [bankId, account.id])}
                                    className="font-mono text-neutral-900 hover:underline"
                                >
                                    {account.label}
                                </Link>
                            </Td>
                            <Td>
                                {account.customers?.length > 0 ? (
                                    <ul className="space-y-1">
                                        {account.customers.map((holder) => (
                                            <li key={holder.id}>
                                                <Link
                                                    href={route('admin.platform.banks.customers.show', [
                                                        bankId,
                                                        holder.id,
                                                    ])}
                                                    className="hover:underline"
                                                >
                                                    <p className="text-neutral-800">{holder.name}</p>
                                                    <p className="font-mono text-xs text-neutral-500">
                                                        {holder.account_number}
                                                    </p>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span className="text-neutral-400">—</span>
                                )}
                            </Td>
                            <Td>{account.type_label}</Td>
                            <Td>
                                <StatusBadge status={account.status} />
                            </Td>
                            <Td align="right" className="font-medium tabular-nums text-neutral-900">
                                {account.balance.formatted}
                            </Td>
                            <Td align="right">
                                <ActionButtonGroup className="justify-end">
                                    <ViewAction href={route('admin.platform.banks.accounts.show', [bankId, account.id])} />
                                    {can.edit && (
                                        <EditAction
                                            href={route('admin.platform.banks.accounts.edit', [bankId, account.id])}
                                        />
                                    )}
                                    {can.delete && (
                                        <DeleteAction
                                            title={
                                                account.balance_minor !== 0 || account.transactions_count > 0
                                                    ? 'Resolve balance and transaction history before deleting'
                                                    : 'Delete account'
                                            }
                                            onClick={() => setDeleting(account)}
                                        />
                                    )}
                                </ActionButtonGroup>
                            </Td>
                        </tr>
                    ))}
                </Table>

                <Pagination paginator={accounts} />
            </Card>

            <DeleteAccountDialog
                account={deleting}
                bankId={bankId}
                onClose={() => setDeleting(null)}
            />
        </BankWorkspaceLayout>
    );
}
