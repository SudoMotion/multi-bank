import FieldWrapper from '@/Components/UI/FieldWrapper';
import { fieldClassName } from '@/Components/UI/styles';
import { cn } from '@/Components/UI';
import { useState } from 'react';

function EyeIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    );
}

function EyeOffIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
            />
        </svg>
    );
}

export default function PasswordField({
    id,
    label,
    value,
    onChange,
    error,
    autoComplete = 'current-password',
    name = 'password',
    visible: visibleProp,
    hideToggle = false,
}) {
    const [internalVisible, setInternalVisible] = useState(false);
    const visible = visibleProp ?? internalVisible;
    const showToggle = !hideToggle && visibleProp === undefined;

    return (
        <FieldWrapper label={label} id={id} error={error} required>
            <div className="relative">
                <input
                    id={id}
                    name={name}
                    type={visible ? 'text' : 'password'}
                    value={value}
                    autoComplete={autoComplete}
                    onChange={onChange}
                    className={cn(
                        fieldClassName,
                        showToggle && 'pr-11',
                        'transition-shadow duration-200 focus:border-[#006ac3] focus:ring-[#006ac3]',
                    )}
                />
                {showToggle && (
                    <button
                        type="button"
                        onClick={() => setInternalVisible((show) => !show)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
                        aria-label={visible ? 'Hide password' : 'Show password'}
                    >
                        {visible ? (
                            <EyeOffIcon className="h-5 w-5" />
                        ) : (
                            <EyeIcon className="h-5 w-5" />
                        )}
                    </button>
                )}
            </div>
        </FieldWrapper>
    );
}
