import { Link } from '@inertiajs/react';

export default function AdminPageHeader({
    title,
    description,
    backHref,
    backLabel,
    actions,
}) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                {backHref && (
                    <Link
                        href={backHref}
                        className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                    >
                        &larr; {backLabel}
                    </Link>
                )}
                <h2 className={`text-xl font-medium text-neutral-900 ${backHref ? 'mt-2' : ''}`}>
                    {title}
                </h2>
                {description && (
                    <p className="mt-1 text-sm text-neutral-500">{description}</p>
                )}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
        </div>
    );
}
