import { Link } from '@inertiajs/react';
import { cn } from './cn';

function decodeLabel(label) {
    return label.replace('&laquo;', '«').replace('&raquo;', '»');
}

/**
 * Renders a Laravel LengthAwarePaginator (links, from, to, total).
 */
export default function Pagination({ paginator, className = '' }) {
    if (!paginator || paginator.total === 0) {
        return null;
    }

    return (
        <div
            className={cn(
                'flex flex-col gap-3 border-t border-neutral-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between',
                className,
            )}
        >
            <p className="text-sm text-neutral-500">
                Showing {paginator.from}–{paginator.to} of {paginator.total}
            </p>

            {paginator.last_page > 1 && (
                <nav className="flex flex-wrap items-center gap-1">
                    {paginator.links.map((link, index) =>
                        link.url ? (
                            <Link
                                key={index}
                                href={link.url}
                                preserveScroll
                                preserveState
                                className={cn(
                                    'min-w-[2rem] rounded-md border px-2.5 py-1 text-center text-sm transition',
                                    link.active
                                        ? 'border-neutral-900 bg-neutral-900 text-white'
                                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50',
                                )}
                            >
                                {decodeLabel(link.label)}
                            </Link>
                        ) : (
                            <span
                                key={index}
                                className="min-w-[2rem] rounded-md border border-neutral-100 px-2.5 py-1 text-center text-sm text-neutral-300"
                            >
                                {decodeLabel(link.label)}
                            </span>
                        ),
                    )}
                </nav>
            )}
        </div>
    );
}
