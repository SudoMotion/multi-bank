import { cn } from './cn';

export function Table({ head, children, empty = 'Nothing to show.', isEmpty = false, className = '' }) {
    return (
        <div className={cn('overflow-x-auto', className)}>
            <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                    <tr>{head}</tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                    {isEmpty ? (
                        <tr>
                            <td colSpan={99} className="px-4 py-10 text-center text-sm text-neutral-500">
                                {empty}
                            </td>
                        </tr>
                    ) : (
                        children
                    )}
                </tbody>
            </table>
        </div>
    );
}

export function Th({ align = 'left', className = '', children }) {
    return (
        <th
            className={cn(
                'px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-neutral-500',
                align === 'right' ? 'text-right' : 'text-left',
                className,
            )}
        >
            {children}
        </th>
    );
}

export function Td({ align = 'left', className = '', children, ...props }) {
    return (
        <td
            {...props}
            className={cn(
                'whitespace-nowrap px-4 py-3 text-sm text-neutral-600',
                align === 'right' && 'text-right',
                className,
            )}
        >
            {children}
        </td>
    );
}
