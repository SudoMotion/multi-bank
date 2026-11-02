import FilterBar from '@/Components/Admin/FilterBar';
import {
    ActionButtonGroup,
    Button,
    Card,
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

export default function Index({ workspace, customers, filters, statuses, can }) {
    const bankId = workspace.bank.id;

    return (
        <BankWorkspaceLayout
            workspace={workspace}
            title="Customers"
            description="Account holders of this bank."
            actions={
                can.create ? (
                    <Link href={route('admin.platform.banks.customers.create', bankId)}>
                        <Button>New customer</Button>
                    </Link>
                ) : null
            }
        >
            <Card bodyClassName="p-0">
                <FilterBar
                    url={route('admin.platform.banks.customers.index', bankId)}
                    filters={filters}
                    fields={[
                        { name: 'search', label: 'Search', placeholder: 'Name, email or customer #' },
                        { name: 'status', label: 'Status', type: 'select', options: statuses },
                    ]}
                />

                <Table
                    isEmpty={customers.data.length === 0}
                    empty="No customers match."
                    head={
                        <>
                            <Th>Customer</Th>
                            <Th>Contact</Th>
                            <Th align="right">Accounts</Th>
                            <Th>Status</Th>
                            <Th>Since</Th>
                            <Th align="right">Actions</Th>
                        </>
                    }
                >
                    {customers.data.map((customer) => (
                        <tr key={customer.id} className="hover:bg-neutral-50/50">
                            <Td>
                                <Link
                                    href={route('admin.platform.banks.customers.show', [bankId, customer.id])}
                                    className="hover:underline"
                                >
                                    <p className="font-medium text-neutral-900">{customer.name}</p>
                                    <p className="font-mono text-xs text-neutral-500">{customer.customer_number}</p>
                                </Link>
                            </Td>
                            <Td>
                                <p>{customer.email ?? '—'}</p>
                                {customer.phone && <p className="text-xs text-neutral-500">{customer.phone}</p>}
                            </Td>
                            <Td align="right">{customer.accounts_count}</Td>
                            <Td>
                                <StatusBadge status={customer.status} />
                            </Td>
                            <Td>{customer.created_at}</Td>
                            <Td align="right">
                                <ActionButtonGroup className="justify-end">
                                    <ViewAction
                                        href={route('admin.platform.banks.customers.show', [bankId, customer.id])}
                                    />
                                    {can.edit && (
                                        <EditAction
                                            href={route('admin.platform.banks.customers.edit', [bankId, customer.id])}
                                        />
                                    )}
                                </ActionButtonGroup>
                            </Td>
                        </tr>
                    ))}
                </Table>

                <Pagination paginator={customers} />
            </Card>
        </BankWorkspaceLayout>
    );
}
