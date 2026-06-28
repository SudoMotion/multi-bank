import { cn } from './cn';

export default function Label({
    htmlFor,
    value,
    required = false,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            htmlFor={htmlFor}
            {...props}
            className={cn('block text-sm font-medium text-gray-700', className)}
        >
            {value ?? children}
            {required && <span className="ms-1 text-red-500">*</span>}
        </label>
    );
}
