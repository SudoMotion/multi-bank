import { forwardRef } from 'react';
import FieldWrapper from './FieldWrapper';
import { cn } from './cn';

const fileInputClassName =
    'block w-full text-sm text-gray-500 file:me-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100';

const FileInput = forwardRef(function FileInput(
    {
        className = '',
        wrapperClassName = '',
        label,
        error,
        required = false,
        id,
        children,
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
            <input
                {...props}
                id={id}
                ref={ref}
                type="file"
                className={cn(fileInputClassName, className)}
            />
            {children}
        </FieldWrapper>
    );
});

export default FileInput;
