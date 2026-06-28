import { forwardRef } from 'react';
import { cn } from './cn';

const Textarea = forwardRef(function Textarea(
    { className = '', rows = 3, ...props },
    ref,
) {
    return (
        <textarea
            {...props}
            ref={ref}
            rows={rows}
            className={cn(
                'block w-full rounded-md border-gray-300 shadow-sm transition focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60',
                className,
            )}
        />
    );
});

export default Textarea;
