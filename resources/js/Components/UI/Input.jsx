import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import FieldWrapper from './FieldWrapper';
import { cn } from './cn';

const inputClassName =
    'block w-full rounded-md border-gray-300 shadow-sm transition focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60';

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
                className={cn(inputClassName, className)}
            />
        </FieldWrapper>
    );
});

export default Input;
