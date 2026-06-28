import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import FieldWrapper from './FieldWrapper';
import { cn } from './cn';

const FileInput = forwardRef(function FileInput(
    {
        className = '',
        wrapperClassName = '',
        label,
        error,
        required = false,
        id,
        buttonLabel = 'Browse',
        placeholder = 'No file chosen',
        hint,
        disabled = false,
        onChange,
        children,
        ...props
    },
    ref,
) {
    const inputRef = useRef(null);
    const [fileName, setFileName] = useState('');

    useImperativeHandle(ref, () => inputRef.current);

    useEffect(() => {
        if (disabled) {
            setFileName('');
        }
    }, [disabled]);

    const handleChange = (event) => {
        const file = event.target.files?.[0];
        setFileName(file?.name ?? '');
        onChange?.(event);
    };

    const openFileDialog = () => {
        if (!disabled) {
            inputRef.current?.click();
        }
    };

    return (
        <FieldWrapper
            label={label}
            id={id}
            error={error}
            required={required}
            className={wrapperClassName}
        >
            <div
                className={cn(
                    'flex h-10 w-full overflow-hidden rounded-md border border-neutral-300 bg-white shadow-sm transition',
                    'focus-within:border-neutral-500 focus-within:ring-1 focus-within:ring-neutral-500',
                    disabled && 'cursor-not-allowed bg-neutral-50 opacity-60',
                    error && 'border-red-300 focus-within:border-red-500 focus-within:ring-red-500',
                    className,
                )}
            >
                <button
                    type="button"
                    onClick={openFileDialog}
                    disabled={disabled}
                    className={cn(
                        'shrink-0 border-r border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-700 transition',
                        'hover:bg-neutral-100 disabled:cursor-not-allowed disabled:hover:bg-neutral-50',
                    )}
                >
                    {buttonLabel}
                </button>

                <button
                    type="button"
                    onClick={openFileDialog}
                    disabled={disabled}
                    className="flex min-w-0 flex-1 items-center px-3 text-left text-sm disabled:cursor-not-allowed"
                >
                    <span
                        className={cn(
                            'truncate',
                            fileName ? 'text-neutral-800' : 'text-neutral-400',
                        )}
                    >
                        {fileName || placeholder}
                    </span>
                </button>

                <input
                    {...props}
                    id={id}
                    ref={inputRef}
                    type="file"
                    disabled={disabled}
                    className="sr-only"
                    onChange={handleChange}
                />
            </div>

            {hint && !error && (
                <p className="mt-1.5 text-xs text-neutral-500">{hint}</p>
            )}

            {children}
        </FieldWrapper>
    );
});

export default FileInput;
