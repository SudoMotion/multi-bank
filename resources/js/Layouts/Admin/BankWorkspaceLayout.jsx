import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { Alert, Badge, Button, cn } from '@/Components/UI';
import { useCan } from '@/hooks/useCan';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from './AdminLayout';

export const workspaceSections = [
    { key: 'overview', label: 'Overview', route: 'admin.platform.banks.overview' },
    { key: 'customers', label: 'Customers', route: 'admin.platform.banks.customers.index', permission: 'customers.view' },
    { key: 'accounts', label: 'Accounts', route: 'admin.platform.banks.accounts.index', permission: 'accounts.view' },
    { key: 'transactions', label: 'Transactions', route: 'admin.platform.banks.transactions.index', permission: 'transactions.view' },
    { key: 'settings', label: 'Site Settings', route: 'admin.platform.banks.settings.index', permission: 'settings.view' },
];

function BankSelector({ workspace }) {
    const current = workspaceSections.find((section) => section.key === workspace.section);

    const switchBank = (e) => {
        router.get(route(current?.route ?? 'admin.platform.banks.overview', e.target.value));
    };

    return (
        <label className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">Bank</span>
            <select
                value={workspace.bank.id}
                onChange={switchBank}
                aria-label="Select bank"
                className="h-9 min-w-[12rem] rounded-md border-neutral-300 text-sm shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
            >
                {workspace.banks.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                        {bank.name}
                        {bank.is_active ? '' : ' (inactive)'}
                    </option>
                ))}
            </select>
        </label>
    );
}

function BankHeader({ workspace }) {
    const can = useCan();
    const { bank } = workspace;

    return (
        <div className="mb-4 overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <div className="h-1" style={{ backgroundColor: bank.primary_color }} />
            <div className="flex flex-col gap-4 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded border border-neutral-200 bg-white p-1">
                        {bank.logo_url ? (
                            <img src={bank.logo_url} alt="" className="max-h-full max-w-full object-contain" />
                        ) : (
                            <span className="text-sm font-semibold text-neutral-400">{bank.name.charAt(0)}</span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="truncate text-base font-semibold text-neutral-900">{bank.name}</p>
                            <Badge variant={bank.is_active ? 'success' : 'neutral'}>
                                {bank.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                        <a
                            href={bank.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-xs text-neutral-500 underline-offset-2 hover:underline"
                        >
                            {bank.host}
                        </a>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <BankSelector workspace={workspace} />
                    {can('tenants.edit') && (
                        <Link href={route('admin.tenants.edit', bank.id)}>
                            <Button variant="secondary" size="sm">
                                Edit bank
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <nav className="flex gap-1 overflow-x-auto border-t border-neutral-100 px-2">
                {workspaceSections
                    .filter((section) => can(section.permission))
                    .map((section) => (
                        <Link
                            key={section.key}
                            href={route(section.route, bank.id)}
                            className={cn(
                                '-mb-px whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition',
                                section.key === workspace.section
                                    ? 'border-neutral-900 text-neutral-900'
                                    : 'border-transparent text-neutral-500 hover:text-neutral-800',
                            )}
                        >
                            {section.label}
                        </Link>
                    ))}
            </nav>
        </div>
    );
}

export default function BankWorkspaceLayout({
    workspace,
    title,
    description,
    actions,
    backHref,
    backLabel,
    children,
}) {
    const { flash } = usePage().props;

    return (
        <AdminLayout title="Super Admin">
            <Head title={`${title} · ${workspace.bank.name}`} />

            <BankHeader workspace={workspace} />

            <AdminPageHeader
                title={title}
                description={description}
                actions={actions}
                backHref={backHref}
                backLabel={backLabel}
            />

            {flash?.success && <Alert variant="success">{flash.success}</Alert>}
            {flash?.error && <Alert variant="error">{flash.error}</Alert>}

            <div key={workspace.bank.id}>{children}</div>
        </AdminLayout>
    );
}
