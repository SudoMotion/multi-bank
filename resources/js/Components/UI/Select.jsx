import { forwardRef } from 'react';
import FieldWrapper from './FieldWrapper';
import { fieldClassName } from './styles';
import { cn } from './cn';

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
                className={cn(fieldClassName, className)}
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
