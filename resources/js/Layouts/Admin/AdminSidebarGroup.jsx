import { useState } from 'react';
import AdminSidebarLink from './AdminSidebarLink';
import { cn } from '@/Components/UI/cn';

export default function AdminSidebarGroup({
    label,
    icon: Icon,
    items,
    onNavigate,
}) {
    const hasActiveChild = items.some((item) => route().current(item.active));
    const [open, setOpen] = useState(hasActiveChild);

    if (items.length === 0) {
        return null;
    }

    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className={cn(
                    'group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    hasActiveChild
                        ? 'bg-neutral-200 text-neutral-900'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                )}
            >
                {Icon && (
                    <Icon
                        className={cn(
                            'h-[18px] w-[18px] shrink-0',
                            hasActiveChild
                                ? 'text-neutral-800'
                                : 'text-neutral-400 group-hover:text-neutral-700',
                        )}
                    />
                )}
                <span className="flex-1 text-left">{label}</span>
                <svg
                    className={cn(
                        'h-4 w-4 shrink-0 text-neutral-400 transition-transform',
                        open && 'rotate-180',
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>

            {open && (
                <div className="mt-0.5 space-y-0.5 border-l border-neutral-200 ms-5 ps-2">
                    {items.map((item) => (
                        <AdminSidebarLink
                            key={item.name}
                            href={route(item.href)}
                            active={route().current(item.active)}
                            onNavigate={onNavigate}
                        >
                            {item.name}
                        </AdminSidebarLink>
                    ))}
                </div>
            )}
        </div>
    );
}
