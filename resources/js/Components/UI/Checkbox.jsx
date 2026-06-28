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
                'rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500',
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
            <span className="text-sm text-gray-700">{label}</span>
        </label>
    );
}
