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
    const input = (
        <input
            {...props}
            id={id}
            type="radio"
            name={name}
            value={value}
            checked={checked}
            className={cn(
                'border-neutral-300 text-neutral-900 shadow-sm focus:ring-neutral-500',
                className,
            )}
        />
    );

    if (!label) {
        return input;
    }

    return (
        <label
            htmlFor={id}
            className={cn('inline-flex cursor-pointer items-center gap-2', labelClassName)}
        >
            {input}
            <span className="text-sm text-neutral-700">{label}</span>
        </label>
    );
}
