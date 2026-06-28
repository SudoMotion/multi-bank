import { forwardRef } from 'react';
import FieldWrapper from './FieldWrapper';
import { cn } from './cn';

const selectClassName =
    'block w-full rounded-md border-gray-300 shadow-sm transition focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60';

const Select = forwardRef(function Select(
    {
        className = '',
        wrapperClassName = '',
        options = [],
        placeholder = 'Select an option',
        label,
        error,
        required = false,
        id,
        ...props
    },
    ref,
) {
    return (
        <FieldWrapper
            label={label}
            id={id}
            error={error}
            required={required}
            className={wrapperClassName}
        >
            <select
                {...props}
                id={id}
                ref={ref}
                className={cn(selectClassName, className)}
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
        </FieldWrapper>
    );
});

export default Select;
