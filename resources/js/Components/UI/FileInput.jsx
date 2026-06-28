import { forwardRef } from 'react';
import FieldWrapper from './FieldWrapper';
import { fieldClassName } from './styles';
import { cn } from './cn';

const fileInputClassName =
    'cursor-pointer px-3 py-2 text-sm text-neutral-500 file:me-4 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-neutral-700 hover:file:bg-neutral-200';

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
                className={cn(fieldClassName, fileInputClassName, className)}
            />
            {children}
        </FieldWrapper>
    );
});

export default FileInput;
