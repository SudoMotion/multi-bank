import { cn } from './cn';

export default function ErrorMessage({ message, className = '', ...props }) {
    if (!message) {
        return null;
    }

    return (
        <p {...props} className={cn('text-sm text-red-600', className)}>
            {message}
        </p>
    );
}
