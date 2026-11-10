import { cn } from '@/Components/UI';
import { Link } from '@inertiajs/react';

const links = [
    { id: 'accounts', label: 'Accounts', route: 'customer.accounts' },
    { id: 'transactions', label: 'Transactions', route: 'customer.transactions' },
    { id: 'profile', label: 'Profile', route: 'customer.profile' },
];

export default function CustomerPanelNav({ current }) {
    return (
        <nav
            className="mb-8 flex flex-wrap gap-2 border-b border-neutral-200 pb-4"
            aria-label="Online banking"
        >
            {links.map((link) => {
                const active = link.id === current;

                if (active) {
                    return (
                        <span
                            key={link.id}
                            className="inline-flex items-center rounded-md bg-[#002d72] px-4 py-2 text-sm font-medium text-white"
                            aria-current="page"
                        >
                            {link.label}
                        </span>
                    );
                }

                return (
                    <Link
                        key={link.id}
                        href={route(link.route)}
                        className={cn(
                            'inline-flex items-center rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-[#006ac3] hover:text-[#006ac3]',
                        )}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
}
