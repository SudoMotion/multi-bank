import { formatAccountBalance } from '@/Components/Customer/AccountList';
import { cn } from '@/Components/UI';

function VerticalMenuIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 4 16" fill="currentColor" aria-hidden>
            <circle cx="2" cy="2" r="1.5" />
            <circle cx="2" cy="8" r="1.5" />
            <circle cx="2" cy="14" r="1.5" />
        </svg>
    );
}

function formatDateTime(isoString) {
    if (!isoString) {
        return '—';
    }

    return new Date(isoString).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

function typePrefix(type) {
    if (type === 'deposit' || type === 'refund') {
        return '+';
    }
    if (type === 'withdraw' || type === 'withdrawal' || type === 'fee' || type === 'transfer_out') {
        return '−';
    }

    return '';
}

function statusDotClass(status) {
    switch (status) {
        case 'completed':
        case 'complete':
            return 'bg-green-500';
        case 'pending':
            return 'bg-[#e6a700]';
        case 'failed':
        case 'canceled':
            return 'bg-red-500';
        default:
            return 'bg-neutral-400';
    }
}

function TransactionAmount({ amount, type }) {
    const prefix = typePrefix(type);

    return (
        <span className="inline-flex items-baseline tabular-nums">
            {prefix && (
                <span className="text-lg text-neutral-900 sm:text-xl">{prefix}</span>
            )}
            <span className="text-lg text-neutral-900 sm:text-xl">${formatAccountBalance(amount)}</span>
            <span className="ml-1 text-sm font-normal text-neutral-500">CAD</span>
        </span>
    );
}

function TransactionCount({ count }) {
    if (count === 0) {
        return null;
    }

    const label = count === 1 ? 'transaction' : 'transactions';

    return (
        <p className="text-base text-neutral-600">
            <span className="mr-2 text-sm text-neutral-500">Total</span>
            <span className="font-semibold tabular-nums text-neutral-900">{count}</span>
            <span className="ml-1 text-sm font-normal text-neutral-500">{label}</span>
        </p>
    );
}

export default function TransactionList({
    transactions,
    sectionTitle = 'Account activity',
    accountFilter = null,
}) {
    return (
        <div className="overflow-hidden">
            {(sectionTitle || transactions.length > 0) && (
                <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-neutral-400">
                    {sectionTitle && (
                        <h2 className="text-lg font-medium text-neutral-900 sm:text-xl">{sectionTitle}</h2>
                    )}
                    <TransactionCount count={transactions.length} />
                </div>
            )}

            {transactions.length === 0 ? (
                <p className="px-5 py-10 text-base text-neutral-600 sm:px-6">
                    {accountFilter
                        ? `No transactions yet for ${accountFilter.name}.`
                        : 'No transactions yet. Activity from your accounts will appear here.'}
                </p>
            ) : (
                <ul>
                    {transactions.map((transaction) => (
                        <li
                            key={transaction.id}
                            className="border-b border-[#d9e2ec] last:border-b-0"
                        >
                            <div className="flex items-start gap-3 py-4 sm:items-center">
                                <div className="min-w-0 flex-1">
                                    <button
                                        type="button"
                                        className="text-left text-lg font-normal text-[#006ac3] hover:underline sm:text-xl"
                                    >
                                        {transaction.account_name}
                                        <span className="ml-0.5" aria-hidden>
                                            &gt;
                                        </span>
                                    </button>
                                    <p className="mt-0.5 text-base text-neutral-500">
                                        {formatDateTime(transaction.created_at)}
                                    </p>
                                    <p className="mt-0.5 text-base capitalize text-neutral-500">
                                        {transaction.type}
                                    </p>
                                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-neutral-600 sm:text-base">
                                        <span className="inline-flex items-center gap-1.5 capitalize">
                                            <span
                                                className={cn(
                                                    'h-2 w-2 shrink-0 rounded-full',
                                                    statusDotClass(transaction.status),
                                                )}
                                                aria-hidden
                                            />
                                            {transaction.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                                    <div className="text-right">
                                        <TransactionAmount
                                            amount={transaction.amount}
                                            type={transaction.type}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="inline-flex h-8 w-8 items-center justify-center text-neutral-500 hover:text-neutral-700"
                                        aria-label={`Options for transaction on ${transaction.account_name}`}
                                    >
                                        <VerticalMenuIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
