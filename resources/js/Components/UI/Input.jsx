import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import FieldWrapper from './FieldWrapper';
import { fieldClassName } from './styles';
import { cn } from './cn';

const Input = forwardRef(function Input(
    {
        type = 'text',
        className = '',
        wrapperClassName = '',
        isFocused = false,
        label,
        error,
        required = false,
        id,
        ...props
    },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

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
                type={type}
                ref={localRef}
                className={cn(fieldClassName, className)}
            />
        </FieldWrapper>
    );
});

export default Input;
