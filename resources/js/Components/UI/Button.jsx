import { cn } from './cn';

const variants = {
    primary:
        'border-transparent bg-gray-800 text-white hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900',
    secondary:
        'border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50',
    danger:
        'border-transparent bg-red-600 text-white hover:bg-red-500 active:bg-red-700',
    outline:
        'border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50',
    ghost:
        'border-transparent bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
};

const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
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
                'inline-flex items-center justify-center rounded-md border font-semibold transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                variants[variant],
                sizes[size],
                className,
            )}
        >
            {children}
        </button>
    );
}
