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
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ' +
                (active
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white')
            }
        >
            {Icon && (
                <Icon
                    className={
                        'h-5 w-5 shrink-0 ' +
                        (active
                            ? 'text-white'
                            : 'text-slate-400 group-hover:text-white')
                    }
                />
            )}
            <span>{children}</span>
        </Link>
    );
}
