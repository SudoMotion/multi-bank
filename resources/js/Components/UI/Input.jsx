import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { cn } from './cn';

const inputClassName =
    'block w-full rounded-md border-gray-300 shadow-sm transition focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60';

const Input = forwardRef(function Input(
    { type = 'text', className = '', isFocused = false, ...props },
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
        <input
            {...props}
            type={type}
            ref={localRef}
            className={cn(inputClassName, className)}
        />
    );
});

export default Input;
