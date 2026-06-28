import { cn } from './cn';

export default function Radio({
    id,
    name,
    value,
    label,
    checked = false,
    className = '',
    labelClassName = '',
    ...props
}) {
    return (
        <label
            htmlFor={id}
            className={cn('inline-flex cursor-pointer items-center gap-2', labelClassName)}
        >
            <input
                {...props}
                id={id}
                type="radio"
                name={name}
                value={value}
                checked={checked}
                className={cn(
                    'border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500',
                    className,
                )}
            />
            {label && <span className="text-sm text-gray-700">{label}</span>}
        </label>
    );
}
