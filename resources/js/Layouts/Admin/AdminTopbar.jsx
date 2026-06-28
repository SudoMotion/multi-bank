import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';

export default function AdminTopbar({ title, onToggleSidebar }) {
    const user = usePage().props.auth.user;

    return (
        <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 lg:hidden"
                    aria-label="Toggle sidebar"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>

                <Link href={route('admin.dashboard')} className="hidden items-center lg:flex">
                    <ApplicationLogo className="block h-8 w-auto fill-current text-gray-800" />
                </Link>

                {title && (
                    <div className="hidden h-6 w-px bg-gray-200 lg:block" aria-hidden="true" />
                )}

                {title && (
                    <h1 className="hidden text-sm font-semibold text-gray-800 sm:block">
                        {title}
                    </h1>
                )}
            </div>

            <div className="flex items-center gap-4">
                <span className="hidden text-sm text-gray-500 md:inline">
                    Admin Panel
                </span>

                <Dropdown>
                    <Dropdown.Trigger>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-md border border-transparent px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-800 focus:outline-none"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                            <span className="hidden sm:inline">{user.name}</span>
                            <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
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
