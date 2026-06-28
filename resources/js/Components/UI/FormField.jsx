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
        <div className={cn('space-y-1', className)}>
            {label && (
                <Label htmlFor={htmlFor} value={label} required={required} />
            )}
            {children}
            <ErrorMessage message={error} />
        </div>
    );
}
