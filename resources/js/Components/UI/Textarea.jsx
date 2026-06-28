import { forwardRef } from 'react';
import FieldWrapper from './FieldWrapper';
import { cn } from './cn';

const textareaClassName =
    'block w-full rounded-md border-gray-300 shadow-sm transition focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60';

const Textarea = forwardRef(function Textarea(
    {
        className = '',
        wrapperClassName = '',
        rows = 3,
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
            <textarea
                {...props}
                id={id}
                ref={ref}
                rows={rows}
                className={cn(textareaClassName, className)}
            />
        </FieldWrapper>
    );
});

export default Textarea;
