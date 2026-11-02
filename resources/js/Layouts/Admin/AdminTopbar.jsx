import AppLogo from '@/Components/AppLogo';
import { Button } from '@/Components/UI';
import Dropdown from '@/Components/Dropdown';
import { useTenant } from '@/tenancy/useTenant';
import { Link, usePage } from '@inertiajs/react';

export default function AdminTopbar({ title, onToggleSidebar }) {
    const user = usePage().props.auth.user;
    const tenant = useTenant();

    return (
        <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-2 md:px-4">
            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onToggleSidebar}
                    className="text-neutral-600 lg:hidden"
                    aria-label="Toggle sidebar"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </Button>

                <Link href={route('admin.dashboard')} className="hidden items-center lg:flex">
                    <AppLogo className="block h-7 w-auto fill-current text-neutral-800" />
                </Link>

                {title && (
                    <>
                        <div className="hidden h-4 w-px bg-neutral-200 lg:block" aria-hidden="true" />
                        <h1 className="hidden text-sm font-medium text-neutral-700 sm:block">
                            {title}
                        </h1>
                    </>
                )}
            </div>

            <div className="flex items-center gap-3">
                <span
                    className={
                        'hidden rounded-full px-2.5 py-1 text-xs font-medium sm:inline-flex ' +
                        (tenant
                            ? 'bg-tenant-primary/10 text-tenant-primary'
                            : 'bg-neutral-100 text-neutral-600')
                    }
                >
                    {tenant ? tenant.name : 'Platform'}
                </span>

                <Dropdown>
                    <Dropdown.Trigger>
                        <Button type="button" variant="ghost" size="sm" className="gap-2 text-neutral-700">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-sm font-medium text-neutral-700">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                            <span className="hidden text-sm font-normal sm:inline">{user.name}</span>
                            <svg className="h-4 w-4 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </Button>
                    </Dropdown.Trigger>

                    <Dropdown.Content>
                        <Dropdown.Link href={route('admin.logout')} method="post" as="button">
                            Log Out
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            </div>
        </header>
    );
}
