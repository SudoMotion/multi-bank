import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { ActionButtonGroup, Alert, Button, Card, EditAction } from '@/Components/UI';
import { Head, Link, usePage } from '@inertiajs/react';

function StatusBadge({ active }) {
    return (
        <span
            className={
                'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ' +
                (active ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-500')
            }
        >
            <span
                className={'h-1.5 w-1.5 rounded-full ' + (active ? 'bg-green-500' : 'bg-neutral-400')}
            />
            {active ? 'Active' : 'Inactive'}
        </span>
    );
}

const headerCell =
    'px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500';

export default function Index({ tenants, can }) {
    const { flash } = usePage().props;

    return (
        <AdminLayout title="Banks">
            <Head title="Banks" />

            <AdminPageHeader
                title="Banks"
                description="Manage member banks, their domains, branding and availability."
                actions={
                    can.create ? (
                        <Link href={route('admin.tenants.create')}>
                            <Button>Add Bank</Button>
                        </Link>
                    ) : null
                }
            />

            {flash?.success && <Alert variant="success">{flash.success}</Alert>}

            <Card bodyClassName="p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className={headerCell}>Bank</th>
                                <th className={headerCell}>Domain</th>
                                <th className={headerCell}>Theme</th>
                                <th className={headerCell}>Users</th>
                                <th className={headerCell}>Status</th>
                                <th className={headerCell + ' text-right'}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 bg-white">
                            {tenants.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-neutral-500">
                                        No banks yet.
                                    </td>
                                </tr>
                            )}
                            {tenants.map((tenant) => (
                                <tr key={tenant.id} className="hover:bg-neutral-50/50">
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-14 shrink-0 items-center justify-center rounded border border-neutral-200 bg-white p-1">
                                                {tenant.logo_url ? (
                                                    <img
                                                        src={tenant.logo_url}
                                                        alt=""
                                                        className="max-h-full max-w-full object-contain"
                                                    />
                                                ) : (
                                                    <span className="text-xs font-semibold text-neutral-400">
                                                        {tenant.name.charAt(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-neutral-900">
                                                    {tenant.name}
                                                </p>
                                                <p className="font-mono text-xs text-neutral-500">
                                                    {tenant.slug}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                                        <a
                                            href={tenant.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-neutral-700 underline-offset-2 hover:underline"
                                        >
                                            {tenant.host}
                                        </a>
                                        {tenant.domain && (
                                            <p className="text-xs text-neutral-400">Custom domain</p>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-600">
                                        {tenant.theme}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-600">
                                        {tenant.users_count}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <StatusBadge active={tenant.is_active} />
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-right">
                                        {can.edit && (
                                            <ActionButtonGroup className="justify-end">
                                                <Link
                                                    href={route('admin.tenants.status', tenant.id)}
                                                    method="patch"
                                                    as="button"
                                                    preserveScroll
                                                    className={
                                                        'rounded-md border px-3 py-1.5 text-xs font-medium transition ' +
                                                        (tenant.is_active
                                                            ? 'border-red-200 text-red-600 hover:bg-red-50'
                                                            : 'border-green-200 text-green-700 hover:bg-green-50')
                                                    }
                                                >
                                                    {tenant.is_active ? 'Deactivate' : 'Activate'}
                                                </Link>
                                                <EditAction href={route('admin.tenants.edit', tenant.id)} />
                                            </ActionButtonGroup>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </AdminLayout>
    );
}
