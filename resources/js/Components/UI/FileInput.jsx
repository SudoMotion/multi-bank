import { forwardRef } from 'react';
import { cn } from './cn';

const FileInput = forwardRef(function FileInput(
    { className = '', ...props },
    ref,
) {
    return (
        <input
            {...props}
            ref={ref}
            type="file"
            className={cn(
                'block w-full text-sm text-gray-500 file:me-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100',
                className,
            )}
        />
    );
});

export default FileInput;
