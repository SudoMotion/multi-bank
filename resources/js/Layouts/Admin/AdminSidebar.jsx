import ApplicationLogo from '@/Components/ApplicationLogo';
import { useCan } from '@/hooks/useCan';
import { Link } from '@inertiajs/react';
import AdminSidebarGroup from './AdminSidebarGroup';
import AdminSidebarLink from './AdminSidebarLink';

function DashboardIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
    );
}

function AccessControlIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
    );
}

function ProductIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5a1.125 1.125 0 00-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
    );
}

function SettingsIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

const accessControlItems = [
    { name: 'Users', href: 'admin.users.index', active: 'admin.users.*', permission: 'users.view' },
    { name: 'Roles', href: 'admin.roles.index', active: 'admin.roles.*', permission: 'roles.view' },
    { name: 'Permissions', href: 'admin.permissions.index', active: 'admin.permissions.*', permission: 'permissions.view' },
];

const topLevelItems = [
    { name: 'Dashboard', href: 'admin.dashboard', active: 'admin.dashboard', icon: DashboardIcon, permission: 'dashboard.view' },
    { name: 'Products', href: 'admin.products.index', active: 'admin.products.*', icon: ProductIcon, permission: 'products.view' },
    { name: 'Settings', href: 'admin.settings.index', active: 'admin.settings.*', icon: SettingsIcon, permission: 'settings.view' },
];

export default function AdminSidebar({ open, onNavigate }) {
    const can = useCan();

    const visibleAccessItems = accessControlItems.filter((item) => can(item.permission));
    const visibleTopLevelItems = topLevelItems.filter((item) => can(item.permission));

    return (
        <aside
            className={
                'fixed bottom-0 left-0 top-14 z-40 flex w-60 flex-col border-r border-neutral-200 bg-neutral-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ' +
                (open ? 'translate-x-0' : '-translate-x-full')
            }
        >
            <div className="flex h-14 shrink-0 items-center border-b border-neutral-200 px-4 lg:hidden">
                <Link href="/" onClick={onNavigate}>
                    <ApplicationLogo className="block h-7 w-auto fill-current text-neutral-800" />
                </Link>
            </div>

            <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
                {visibleTopLevelItems.slice(0, 1).map((item) => (
                    <AdminSidebarLink
                        key={item.name}
                        href={route(item.href)}
                        active={route().current(item.active)}
                        icon={item.icon}
                        onNavigate={onNavigate}
                    >
                        {item.name}
                    </AdminSidebarLink>
                ))}

                {visibleAccessItems.length > 0 && (
                    <AdminSidebarGroup
                        label="Access Control"
                        icon={AccessControlIcon}
                        items={visibleAccessItems}
                        onNavigate={onNavigate}
                    />
                )}

                {visibleTopLevelItems.slice(1).map((item) => (
                    <AdminSidebarLink
                        key={item.name}
                        href={route(item.href)}
                        active={route().current(item.active)}
                        icon={item.icon}
                        onNavigate={onNavigate}
                    >
                        {item.name}
                    </AdminSidebarLink>
                ))}
            </nav>

            <div
                className="hidden h-10 shrink-0 border-t border-neutral-200 bg-neutral-50 lg:block"
                aria-hidden="true"
            />
        </aside>
    );
}
