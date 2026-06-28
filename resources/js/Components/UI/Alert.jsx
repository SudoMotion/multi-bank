import { cn } from './cn';

const variants = {
    success: 'border-green-200 bg-green-50 text-green-800',
    error: 'border-red-200 bg-red-50 text-red-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    info: 'border-blue-200 bg-blue-50 text-blue-800',
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
