import ErrorMessage from './ErrorMessage';
import Label from './Label';
import { cn } from './cn';

export default function FieldWrapper({
    label,
    htmlFor,
    id,
    error,
    required = false,
    className = '',
    children,
}) {
    const fieldId = htmlFor || id;
    const hasWrapper = label || error || className;

    if (!hasWrapper) {
        return children;
    }

    return (
        <div className={cn('w-full space-y-1', className)}>
            {label ? (
                <Label htmlFor={fieldId} value={label} required={required} />
            ) : null}
            {children}
            <ErrorMessage message={error} />
        </div>
    );
}
