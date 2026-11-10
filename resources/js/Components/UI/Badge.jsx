import { cn } from './cn';

const variants = {
    success: { pill: 'bg-green-50 text-green-700', dot: 'bg-green-500' },
    neutral: { pill: 'bg-neutral-100 text-neutral-600', dot: 'bg-neutral-400' },
    warning: { pill: 'bg-amber-50 text-amber-800', dot: 'bg-amber-500' },
    danger: { pill: 'bg-red-50 text-red-700', dot: 'bg-red-500' },
    info: { pill: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
};

const statusVariants = {
    active: 'success',
    inactive: 'neutral',
    frozen: 'info',
    suspended: 'warning',
    closed: 'neutral',
    complete: 'success',
    pending: 'warning',
    failed: 'danger',
    canceled: 'neutral',
};

export function statusVariant(status) {
    return statusVariants[status] ?? 'neutral';
}

export default function Badge({ variant = 'neutral', dot = true, className = '', children }) {
    const styles = variants[variant] ?? variants.neutral;

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium',
                styles.pill,
                className,
            )}
        >
            {dot && <span className={cn('h-1.5 w-1.5 rounded-full', styles.dot)} />}
            {children}
        </span>
    );
}

export function StatusBadge({ status, label }) {
    return (
        <Badge variant={statusVariant(status)}>
            {label ?? status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
}
