import { cn } from '@/Components/UI/cn';

export function AdminForm({ className = '', children, ...props }) {
    return (
        <form className={cn('w-full', className)} {...props}>
            {children}
        </form>
    );
}

export function AdminFormGrid({ className = '', children }) {
    return (
        <div className={cn('grid w-full gap-3 sm:grid-cols-2', className)}>
            {children}
        </div>
    );
}
