import { fieldClassName } from './styles';
import { cn } from './cn';

const variants = {
    primary:
        'border-transparent bg-neutral-900 text-white hover:bg-neutral-800 focus:bg-neutral-800 active:bg-neutral-950',
    secondary:
        'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50',
    danger:
        'border-transparent bg-red-600 text-white hover:bg-red-500 active:bg-red-700',
    outline:
        'border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-50',
    ghost:
        'border-transparent bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
};

const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-base',
};

export default function Button({
    type = 'button',
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            disabled={disabled}
            className={cn(
                'inline-flex items-center justify-center rounded-md border font-medium transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                variants[variant],
                sizes[size],
                className,
            )}
        >
            {children}
        </button>
    );
}
