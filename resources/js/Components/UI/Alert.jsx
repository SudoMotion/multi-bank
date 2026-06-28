import { cn } from './cn';

const variants = {
    success: 'border-neutral-200 bg-neutral-50 text-neutral-800',
    error: 'border-red-200 bg-red-50 text-red-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
    info: 'border-neutral-200 bg-neutral-50 text-neutral-700',
};

export default function Alert({
    variant = 'info',
    className = '',
    children,
    ...props
}) {
    if (!children) {
        return null;
    }

    return (
        <div
            {...props}
            className={cn(
                'rounded-md border px-4 py-3 text-sm',
                variants[variant],
                className,
            )}
        >
            {children}
        </div>
    );
}
