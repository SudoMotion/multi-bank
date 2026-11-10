import ChangeCustomerPasswordDialog from '@/Components/Admin/ChangeCustomerPasswordDialog';
import { Button, Card, StatusBadge, Table, Td, Th } from '@/Components/UI';
import BankWorkspaceLayout from '@/Layouts/Admin/BankWorkspaceLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

function Detail({ label, children }) {
    return (
        <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</dt>
            <dd className="mt-0.5 text-sm text-neutral-900">{children || '—'}</dd>
        </div>
    );
}

export default function Show({ workspace, customer, can }) {
    const bankId = workspace.bank.id;
    const [passwordOpen, setPasswordOpen] = useState(false);

    const destroy = () => {
        if (confirm(`Delete ${customer.name}? This cannot be undone.`)) {
            router.delete(route('admin.platform.banks.customers.destroy', [bankId, customer.id]));
        }
    };

    return (
        <BankWorkspaceLayout
            workspace={workspace}
            title={customer.name}
            description={`Account ${customer.account_number} · since ${customer.created_at}`}
            backHref={route('admin.platform.banks.customers.index', bankId)}
            backLabel="Back to customers"
            actions={
                <div className="flex gap-2">
                    {can.delete && (
                        <Button variant="secondary" className="text-red-600" onClick={destroy}>
                            Delete
                        </Button>
                    )}
                    {can.edit && (
                        <>
                            <Button variant="secondary" onClick={() => setPasswordOpen(true)}>
                                Change password
                            </Button>
                            <Link href={route('admin.platform.banks.customers.edit', [bankId, customer.id])}>
                                <Button variant="secondary">Edit</Button>
                            </Link>
                        </>
                    )}
                </div>
            }
        >
            <div className="grid gap-4 lg:grid-cols-3">
                <Card title="Profile">
                    <dl className="space-y-3">
                        <Detail label="Account number">
                            <span className="font-mono">{customer.account_number}</span>
                        </Detail>
                        <Detail label="Status">
                            <StatusBadge status={customer.status} />
                        </Detail>
                        <Detail label="Email">{customer.email}</Detail>
                        <Detail label="Phone">{customer.phone}</Detail>
                        <Detail label="Date of birth">{customer.date_of_birth}</Detail>
                        <Detail label="Address">
                            {customer.address && <span className="whitespace-pre-line">{customer.address}</span>}
                        </Detail>
                    </dl>
                </Card>

                <Card
                    title="Accounts"
                    className="lg:col-span-2"
                    bodyClassName="p-0"
                    actions={
                        can.openAccount && customer.status === 'active' ? (
                            <Link
                                href={route('admin.platform.banks.accounts.create', {
                                    tenant: bankId,
                                    customer: customer.id,
                                })}
                            >
                                <Button size="sm">Open account</Button>
                            </Link>
                        ) : null
                    }
                >
                    <Table
                        isEmpty={customer.accounts.length === 0}
                        empty="This customer has no accounts yet."
                        head={
                            <>
                                <Th>Account</Th>
                                <Th>Type</Th>
                                <Th>Status</Th>
                                <Th>Opened</Th>
                                <Th align="right">Balance</Th>
                            </>
                        }
                    >
                        {customer.accounts.map((account) => (
                            <tr key={account.id} className="hover:bg-neutral-50/50">
                                <Td>
                                    <Link
                                        href={route('admin.platform.banks.accounts.show', [bankId, account.id])}
                                        className="font-mono text-neutral-900 hover:underline"
                                    >
                                        {account.label}
                                    </Link>
                                </Td>
                                <Td>{account.type}</Td>
                                <Td>
                                    <StatusBadge status={account.status} />
                                </Td>
                                <Td>{account.opened_at}</Td>
                                <Td align="right" className="font-medium tabular-nums text-neutral-900">
                                    {account.balance.formatted}
                                </Td>
                            </tr>
                        ))}
                    </Table>
                </Card>
            </div>
            <ChangeCustomerPasswordDialog
                customer={passwordOpen ? customer : null}
                bankId={bankId}
                onClose={() => setPasswordOpen(false)}
            />
        </BankWorkspaceLayout>
    );
}
