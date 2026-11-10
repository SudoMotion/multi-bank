import { Link } from '@inertiajs/react';
import { cn } from './cn';

const baseClassName =
    'inline-flex items-center justify-center rounded-md border p-2 transition focus:outline-none focus:ring-2 focus:ring-offset-1';

const variants = {
    view: 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 focus:ring-neutral-400',
    edit: 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 focus:ring-neutral-400',
    key: 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 focus:ring-neutral-400',
    transaction:
        'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 focus:ring-neutral-400',
    delete: 'border-red-200 bg-white text-red-600 hover:bg-red-50 focus:ring-red-400',
    add: 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 focus:ring-neutral-400',
    remove: 'border-red-200 bg-white text-red-600 hover:bg-red-50 focus:ring-red-400',
};

function ActionIcon({ type }) {
    if (type === 'view') {
        return (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        );
    }

    if (type === 'edit') {
        return (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
        );
    }

    if (type === 'add') {
        return (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
        );
    }

    if (type === 'remove') {
        return (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        );
    }

    if (type === 'delete') {
        return (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
        );
    }

    if (type === 'transaction') {
        return (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.34 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.375M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                />
            </svg>
        );
    }

    if (type === 'key') {
        return (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                />
            </svg>
        );
    }

    return null;
}

function ActionButton({
    type,
    title,
    href,
    method,
    as,
    className = '',
    children,
    onClick,
    ...props
}) {
    const isLabeled = Boolean(children);
    const classNames = cn(
        baseClassName,
        variants[type],
        isLabeled && 'gap-1.5 px-3 py-2',
        className,
    );

    const content = (
        <>
            <ActionIcon type={type} />
            {isLabeled ? (
                <span className="text-sm font-medium">{children}</span>
            ) : (
                <span className="sr-only">{title}</span>
            )}
        </>
    );

    if (href) {
        return (
            <Link
                href={href}
                method={method}
                as={as}
                className={classNames}
                title={title}
                onClick={onClick}
                {...props}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            type="button"
            className={classNames}
            title={title}
            onClick={onClick}
            {...props}
        >
            {content}
        </button>
    );
}

export function ViewAction(props) {
    return <ActionButton type="view" title="View" {...props} />;
}

export function EditAction(props) {
    return <ActionButton type="edit" title="Edit" {...props} />;
}

export function PasswordAction({ title = 'Change password', ...props }) {
    return <ActionButton type="key" title={title} {...props} />;
}

export function TransactionAction({ title = 'Transaction', ...props }) {
    return <ActionButton type="transaction" title={title} {...props} />;
}

export function DeleteAction({ method = 'delete', as = 'button', ...props }) {
    return (
        <ActionButton
            type="delete"
            title="Delete"
            method={method}
            as={as}
            {...props}
        />
    );
}

export function AddAction({ title = 'Add', ...props }) {
    return <ActionButton type="add" title={title} {...props} />;
}

export function RemoveAction({ title = 'Remove', ...props }) {
    return <ActionButton type="remove" title={title} {...props} />;
}

export function ActionButtonGroup({ children, className = '' }) {
    return <div className={cn('flex items-center gap-2', className)}>{children}</div>;
}
