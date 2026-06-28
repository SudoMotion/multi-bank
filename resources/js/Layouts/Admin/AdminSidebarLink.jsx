import { Link } from '@inertiajs/react';

export default function AdminSidebarLink({
    href,
    active = false,
    icon: Icon,
    children,
    onNavigate,
}) {
    return (
        <Link
            href={href}
            onClick={onNavigate}
            className={
                'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ' +
                (active
                    ? 'bg-neutral-200 text-neutral-900'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900')
            }
        >
            {Icon && (
                <Icon
                    className={
                        'h-[18px] w-[18px] shrink-0 ' +
                        (active
                            ? 'text-neutral-800'
                            : 'text-neutral-400 group-hover:text-neutral-700')
                    }
                />
            )}
            <span>{children}</span>
        </Link>
    );
}
