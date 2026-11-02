import { useEffect, useRef } from 'react';
import { cn } from './cn';
import { useToast } from './toast';

const inlineVariants = {
    success: 'border-neutral-200 bg-neutral-50 text-neutral-800',
    error: 'border-red-200 bg-red-50 text-red-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
    info: 'border-neutral-200 bg-neutral-50 text-neutral-700',
};

function messageFromChildren(children) {
    if (typeof children === 'string' || typeof children === 'number') {
        return String(children);
    }

    return null;
}

export default function Alert({
    variant = 'info',
    className = '',
    children,
    inline = false,
    duration,
    ...props
}) {
    const { show } = useToast();
    const lastShown = useRef(null);

    useEffect(() => {
        if (inline || !children) {
            return;
        }

        const message = messageFromChildren(children);
        if (!message || lastShown.current === message) {
            return;
        }

        lastShown.current = message;
        show({ variant, message, duration, className });
    }, [children, variant, inline, duration, className, show]);

    if (!children) {
        return null;
    }

    if (!inline) {
        return null;
    }

    return (
        <div
            {...props}
            className={cn(
                'rounded-md border px-4 py-3 text-sm',
                inlineVariants[variant],
                className,
            )}
        >
            {children}
        </div>
    );
}
