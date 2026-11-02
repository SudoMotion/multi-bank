import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { Alert, Badge, Button, Card, StatCard, Table, Td, Th, cn } from '@/Components/UI';
import { useCan } from '@/hooks/useCan';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ banks, totals, selectedBankId }) {
    const { flash } = usePage().props;
    const can = useCan();

    return (
        <AdminLayout title="Super Admin">
            <Head title="Super Admin" />

            <AdminPageHeader
                title="Super Admin"
                description="Pick a bank to manage its customers, accounts, transactions and site settings."
                actions={
                    can('tenants.create') ? (
                        <Link href={route('admin.tenants.create')}>
                            <Button>Add Bank</Button>
                        </Link>
                    ) : null
                }
            />

            {flash?.success && <Alert variant="success">{flash.success}</Alert>}
            {flash?.error && <Alert variant="error">{flash.error}</Alert>}

            <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Banks" value={totals.banks} hint={`${totals.active_banks} active`} />
                <StatCard label="Customers" value={totals.customers} hint="Across all banks" />
                <StatCard label="Open Accounts" value={totals.accounts} hint="Active and frozen" />
                <StatCard
                    label="Deposits Held"
                    value={totals.balances[0] ?? '—'}
                    hint={totals.balances.slice(1).join(' · ') || 'All banks combined'}
                />
            </div>

            <Card title="Banks" bodyClassName="p-0">
                <Table
                    isEmpty={banks.length === 0}
                    empty="No banks yet."
                    head={
                        <>
                            <Th>Bank</Th>
                            <Th>Status</Th>
                            <Th align="right">Customers</Th>
                            <Th align="right">Accounts</Th>
                            <Th align="right">Balances</Th>
                            <Th align="right">Txns (30d)</Th>
                            <Th align="right">Actions</Th>
                        </>
                    }
                >
                    {banks.map((bank) => (
                        <tr
                            key={bank.id}
                            className={cn(
                                'hover:bg-neutral-50/50',
                                bank.id === selectedBankId && 'bg-neutral-50',
                            )}
                        >
                            <Td>
                                <Link
                                    href={route('admin.platform.banks.overview', bank.id)}
                                    className="flex items-center gap-3"
                                >
                                    <div className="flex h-9 w-14 shrink-0 items-center justify-center rounded border border-neutral-200 bg-white p-1">
                                        {bank.logo_url ? (
                                            <img src={bank.logo_url} alt="" className="max-h-full max-w-full object-contain" />
                                        ) : (
                                            <span className="text-xs font-semibold text-neutral-400">
                                                {bank.name.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-neutral-900">{bank.name}</p>
                                        <p className="font-mono text-xs text-neutral-500">{bank.host}</p>
                                    </div>
                                </Link>
                            </Td>
                            <Td>
                                <Badge variant={bank.is_active ? 'success' : 'neutral'}>
                                    {bank.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </Td>
                            <Td align="right">{bank.customers_count}</Td>
                            <Td align="right">{bank.accounts_count}</Td>
                            <Td align="right" className="font-medium text-neutral-900">
                                {bank.balances.length ? bank.balances.join(' · ') : '—'}
                            </Td>
                            <Td align="right">{bank.transactions_30d}</Td>
                            <Td align="right">
                                <Link href={route('admin.platform.banks.overview', bank.id)}>
                                    <Button size="sm" variant={bank.id === selectedBankId ? 'primary' : 'secondary'}>
                                        Manage
                                    </Button>
                                </Link>
                            </Td>
                        </tr>
                    ))}
                </Table>
            </Card>
        </AdminLayout>
    );
}
