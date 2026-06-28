import { forwardRef } from 'react';
import FieldWrapper from './FieldWrapper';
import { fieldClassName } from './styles';
import { cn } from './cn';

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
                className={cn(fieldClassName, className)}
            />
        </FieldWrapper>
    );
});

export default Textarea;
