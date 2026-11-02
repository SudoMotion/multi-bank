import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { cn } from './cn';

const ToastContext = createContext(null);

let toastId = 0;

const variantStyles = {
    success:
        'border-l-green-500 bg-white text-neutral-800 ring-1 ring-neutral-200/80',
    error: 'border-l-red-500 bg-white text-red-900 ring-1 ring-red-100',
    warning:
        'border-l-amber-500 bg-white text-amber-950 ring-1 ring-amber-100',
    info: 'border-l-neutral-400 bg-white text-neutral-700 ring-1 ring-neutral-200/80',
};

const iconStyles = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-amber-600',
    info: 'text-neutral-500',
};

function ToastIcon({ variant }) {
    const className = cn('h-5 w-5 shrink-0', iconStyles[variant]);

    if (variant === 'success') {
        return (
            <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                />
            </svg>
        );
    }

    if (variant === 'error') {
        return (
            <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                />
            </svg>
        );
    }

    if (variant === 'warning') {
        return (
            <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path
                    fillRule="evenodd"
                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                />
            </svg>
        );
    }

    return (
        <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clipRule="evenodd"
            />
        </svg>
    );
}

function ToastItem({ toast, onDismiss }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const enter = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(enter);
    }, []);

    const handleDismiss = () => {
        setVisible(false);
        window.setTimeout(() => onDismiss(toast.id), 200);
    };

    return (
        <div
            role="status"
            className={cn(
                'pointer-events-auto flex w-full max-w-sm items-start gap-3 border-l-4 px-4 py-3 text-sm shadow-lg transition-all duration-200 ease-out',
                variantStyles[toast.variant] ?? variantStyles.info,
                toast.className,
                visible
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-4 opacity-0',
            )}
        >
            <ToastIcon variant={toast.variant} />
            <p className="min-w-0 flex-1 pt-0.5 leading-snug">{toast.message}</p>
            <button
                type="button"
                onClick={handleDismiss}
                className="shrink-0 rounded p-0.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600"
                aria-label="Dismiss notification"
            >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
            </button>
        </div>
    );
}

function ToastViewport({ toasts, onDismiss }) {
    if (toasts.length === 0) {
        return null;
    }

    return (
        <div
            aria-live="polite"
            className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-end gap-2 px-4 sm:inset-x-auto sm:right-4 sm:px-0"
        >
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
            ))}
        </div>
    );
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const show = useCallback(
        ({ variant = 'info', message, duration, className = '' }) => {
            if (!message) {
                return null;
            }

            const id = ++toastId;
            const resolvedDuration =
                duration ??
                (variant === 'error' ? 7000 : variant === 'warning' ? 6000 : 4500);

            setToasts((current) => [
                ...current,
                { id, variant, message, className },
            ]);

            if (resolvedDuration > 0) {
                window.setTimeout(() => dismiss(id), resolvedDuration);
            }

            return id;
        },
        [dismiss],
    );

    return (
        <ToastContext.Provider value={{ show, dismiss }}>
            {children}
            <ToastViewport toasts={toasts} onDismiss={dismiss} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }

    return context;
}
