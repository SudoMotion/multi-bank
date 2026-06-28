import { cn } from './cn';

export default function Card({
    title,
    description,
    actions,
    className = '',
    bodyClassName = '',
    children,
}) {
    return (
        <div className={cn('rounded-lg border border-neutral-200 bg-white', className)}>
            {(title || description || actions) && (
                <div className="flex items-start justify-between gap-3 border-b border-neutral-100 px-4 py-3">
                    <div>
                        {title && (
                            <h3 className="text-base font-medium text-neutral-900">{title}</h3>
                        )}
                        {description && (
                            <p className="mt-1 text-sm text-neutral-500">{description}</p>
                        )}
                    </div>
                    {actions && <div className="shrink-0">{actions}</div>}
                </div>
            )}
            <div className={cn('p-4', bodyClassName)}>{children}</div>
        </div>
    );
}
