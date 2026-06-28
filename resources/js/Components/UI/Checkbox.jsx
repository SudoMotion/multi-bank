import { cn } from './cn';

export default function Checkbox({
    id,
    label,
    className = '',
    labelClassName = '',
    ...props
}) {
    const checkbox = (
        <input
            {...props}
            id={id}
            type="checkbox"
            className={cn(
                'rounded border-neutral-300 text-neutral-900 shadow-sm focus:ring-neutral-500',
                className,
            )}
        />
    );

    if (!label) {
        return checkbox;
    }

    return (
        <label htmlFor={id} className={cn('inline-flex items-center gap-2', labelClassName)}>
            {checkbox}
            <span className="text-sm text-neutral-700">{label}</span>
        </label>
    );
}
