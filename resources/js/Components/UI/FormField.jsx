import ErrorMessage from './ErrorMessage';
import Label from './Label';
import { cn } from './cn';

export default function FormField({
    label,
    htmlFor,
    error,
    required = false,
    className = '',
    children,
}) {
    return (
        <div className={cn('w-full space-y-1', className)}>
            {label ? (
                <Label htmlFor={htmlFor} value={label} required={required} />
            ) : null}
            {children}
            <ErrorMessage message={error} />
        </div>
    );
}
