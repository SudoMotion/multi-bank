import { cn } from '@/Components/UI';

export default function CustomerPanelSection({
    title,
    headerExtra = null,
    children,
    className = '',
    bodyClassName = '',
}) {
    return (
        <div className={cn('overflow-hidden border border-[#c5d4e3] bg-white shadow-sm', className)}>
            {(title || headerExtra) && (
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#c5d4e3] bg-[#fafbfc] px-5 py-3 sm:px-6">
                    {title && <h2 className="text-base font-semibold text-neutral-900">{title}</h2>}
                    {headerExtra}
                </div>
            )}
            <div className={bodyClassName}>{children}</div>
        </div>
    );
}
