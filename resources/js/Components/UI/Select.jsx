import { forwardRef } from 'react';
import { cn } from './cn';

const Select = forwardRef(function Select(
    {
        className = '',
        options = [],
        placeholder = 'Select an option',
        ...props
    },
    ref,
) {
    return (
        <select
            {...props}
            ref={ref}
            className={cn(
                'block w-full rounded-md border-gray-300 shadow-sm transition focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60',
                className,
            )}
        >
            {placeholder && (
                <option value="" disabled>
                    {placeholder}
                </option>
            )}
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
});

export default Select;
