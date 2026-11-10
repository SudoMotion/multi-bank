import { cn } from '@/Components/UI';
import { Link, usePage } from '@inertiajs/react';

function timeGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
        return 'Good Morning';
    }

    if (hour < 17) {
        return 'Good Afternoon';
    }

    return 'Good Evening';
}

function ProfileIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    );
}

function AccountsIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
    );
}

function TransactionsIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
    );
}

const shortcuts = [
    { id: 'accounts', label: 'Accounts', routeName: 'customer.accounts', Icon: AccountsIcon },
    { id: 'transactions', label: 'Transactions', routeName: 'customer.transactions', Icon: TransactionsIcon },
    { id: 'profile', label: 'Profile', routeName: 'customer.profile', Icon: ProfileIcon },
];

export default function CustomerPanelHero({ current, title, description }) {
    const { auth } = usePage().props;
    const customer = auth?.customer;
    const firstName =
        customer?.first_name?.trim() ||
        customer?.name?.trim()?.split(/\s+/)[0] ||
        null;

    const showPersonalGreeting = Boolean(firstName);

    return (
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
                {showPersonalGreeting ? (
                    <>
                        <p className="text-sm font-medium text-blue-100">Online Banking</p>
                        <h1 className="mt-1 text-3xl font-light tracking-tight text-white sm:text-4xl">
                            {timeGreeting()}, {firstName}
                        </h1>
                        {description && (
                            <p className="mt-3 text-sm leading-relaxed text-blue-50/90">{description}</p>
                        )}
                    </>
                ) : (
                    <>
                        <p className="text-sm font-medium text-blue-100">Online Banking</p>
                        {title && (
                            <h1 className="mt-1 text-3xl font-light tracking-tight text-white sm:text-4xl">
                                {title}
                            </h1>
                        )}
                        {description && (
                            <p className="mt-3 text-sm leading-relaxed text-blue-50/90">{description}</p>
                        )}
                    </>
                )}
            </div>

            {showPersonalGreeting && (
                <nav
                    className="flex flex-wrap gap-6 sm:gap-8"
                    aria-label="Online banking shortcuts"
                >
                    {shortcuts.map(({ id, label, routeName, Icon }) => {
                        const active = id === current;
                        const className = cn(
                            'group flex flex-col items-center gap-2 text-center transition-opacity',
                            active ? 'opacity-100' : 'opacity-85 hover:opacity-100',
                        );

                        const content = (
                            <>
                                <span
                                    className={cn(
                                        'flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-sm',
                                        active && 'border-white bg-white/20',
                                    )}
                                >
                                    <Icon className="h-5 w-5 text-white" />
                                </span>
                                <span className="text-xs font-medium text-white sm:text-sm">{label}</span>
                            </>
                        );

                        if (active) {
                            return (
                                <span key={id} className={className} aria-current="page">
                                    {content}
                                </span>
                            );
                        }

                        return (
                            <Link key={id} href={route(routeName)} className={className}>
                                {content}
                            </Link>
                        );
                    })}
                </nav>
            )}
        </div>
    );
}
