import { formatAccountBalance } from '@/Components/Customer/AccountList';
import { cn } from '@/Components/UI';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

function UserCircleIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.981 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
        </svg>
    );
}

function MenuLink({ href, children, className }) {
    return (
        <Link
            href={href}
            className={cn(
                'block px-4 py-2.5 text-sm text-neutral-800 transition-colors hover:bg-neutral-50',
                className,
            )}
        >
            {children}
        </Link>
    );
}

export default function CustomerAccountMenu({ className = '' }) {
    const { customerSummary } = usePage().props;
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const handleClickOutside = (event) => {
            if (rootRef.current && !rootRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open]);

    if (!customerSummary) {
        return null;
    }

    return (
        <div ref={rootRef} className={cn('relative', className)}>
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition-colors hover:bg-white/20 md:h-11 md:w-11"
                aria-expanded={open}
                aria-haspopup="true"
                aria-label="Account menu"
            >
                <UserCircleIcon className="h-7 w-7" />
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-md border border-neutral-200 bg-white py-1 shadow-lg">
                    <div className="border-b border-neutral-100 px-4 py-3">
                        <p className="truncate text-sm font-medium text-neutral-900">
                            {customerSummary.name}
                        </p>
                        <p className="mt-0.5 text-xs text-neutral-500">Signed in</p>
                    </div>

                    <Link
                        href={route('customer.accounts')}
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-neutral-800 transition-colors hover:bg-neutral-50"
                        onClick={() => setOpen(false)}
                    >
                        <span>Accounts</span>
                        <span className="font-medium tabular-nums text-[#002d72]">
                            {formatAccountBalance(customerSummary.total_balance)}
                        </span>
                    </Link>

                    <MenuLink href={route('customer.transactions')} onClick={() => setOpen(false)}>
                        Transactions
                    </MenuLink>

                    <MenuLink href={route('customer.profile')} onClick={() => setOpen(false)}>
                        Profile
                    </MenuLink>

                    <div className="mt-1 border-t border-neutral-100 pt-1">
                        <Link
                            href={route('customer.logout')}
                            method="post"
                            as="button"
                            className="block w-full px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                            onClick={() => setOpen(false)}
                        >
                            Logout
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
