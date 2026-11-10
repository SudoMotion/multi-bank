import { cn } from '@/Components/UI';
import { Link } from '@inertiajs/react';

export function formatAccountBalance(value) {
    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return '0.00';
    }

    return amount.toLocaleString('en-CA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function formatCurrency(value, currency = 'CAD') {
    return `$${formatAccountBalance(value)} ${currency}`;
}

function VerticalMenuIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 4 16" fill="currentColor" aria-hidden>
            <circle cx="2" cy="2" r="1.5" />
            <circle cx="2" cy="8" r="1.5" />
            <circle cx="2" cy="14" r="1.5" />
        </svg>
    );
}

function PlusCircleIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M10 6v8M6 10h8" />
        </svg>
    );
}

function BalanceAmount({ amount, currency = 'CAD' }) {
    return (
        <span className="inline-flex items-baseline gap-1 tabular-nums">
            <span className="text-lg text-neutral-900 sm:text-xl">${formatAccountBalance(amount)}</span>
            <span className="text-sm font-normal text-neutral-500">{currency}</span>
        </span>
    );
}

function CurrencyTotals({ totals }) {
    if (!totals?.length) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-baseline justify-end text-base text-neutral-600">
            <span className="mr-2 text-sm text-neutral-500">Total</span>
            {totals.map(({ currency, amount }, index) => (
                <span key={currency} className="inline-flex items-baseline">
                    {index > 0 && (
                        <span className="mx-2 text-neutral-400" aria-hidden>
                            |
                        </span>
                    )}
                    <BalanceAmount amount={amount} currency={currency} />
                </span>
            ))}
        </div>
    );
}

export default function AccountList({
    accounts,
    sectionTitle = 'Bank Accounts',
    currencyTotals = [],
}) {
    return (
        <div className="overflow-hidden">
            {(sectionTitle || currencyTotals.length > 0) && (
                <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-neutral-400">
                    {sectionTitle && (
                        <h2 className="text-lg font-medium text-neutral-900 sm:text-xl">{sectionTitle}</h2>
                    )}
                    <CurrencyTotals totals={currencyTotals} />
                </div>
            )}

            {accounts.length === 0 ? (
                <p className="px-5 py-10 text-base text-neutral-600 sm:px-6">
                    No accounts are assigned to your profile yet.
                </p>
            ) : (
                <>
                    <ul>
                        {accounts.map((account) => {
                            const inactive = account.status === 'inactive';
                            const subtitle = [account.account_type, account.masked_number]
                                .filter(Boolean)
                                .join(' ');

                            return (
                                <li
                                    key={account.id}
                                    className="border-b border-[#d9e2ec] last:border-b-0"
                                >
                                    <div className="flex items-start gap-3 py-4 sm:items-center">
                                        <div className="min-w-0 flex-1">
                                            <Link
                                                href={route('customer.transactions', { account: account.id })}
                                                className="text-left text-lg font-normal text-[#006ac3] hover:underline sm:text-xl"
                                            >
                                                {account.name}
                                                <span className="ml-0.5" aria-hidden>
                                                    &gt;
                                                </span>
                                            </Link>
                                            {subtitle && (
                                                <p className="mt-0.5 text-base text-neutral-500">{subtitle}</p>
                                            )}
                                            {inactive && (
                                                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-neutral-600 sm:text-base">
                                                    <span
                                                        className="inline-flex items-center gap-1.5"
                                                        aria-label="Inactive account"
                                                    >
                                                        <span
                                                            className="h-2 w-2 shrink-0 rounded-full bg-[#e6a700]"
                                                            aria-hidden
                                                        />
                                                        Inactive Account
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="text-[#006ac3] hover:underline"
                                                    >
                                                        Learn More
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                                            <div className="text-right">
                                                <BalanceAmount
                                                    amount={account.balance}
                                                    currency={account.currency || 'CAD'}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                className={cn(
                                                    'inline-flex h-8 w-8 items-center justify-center text-neutral-500 hover:text-neutral-700',
                                                )}
                                                aria-label={`Options for ${account.name}`}
                                            >
                                                <VerticalMenuIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="border-t border-[#d9e2ec] px-5 py-4 sm:px-6">
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 text-lg font-normal text-[#006ac3] hover:underline sm:text-xl"
                        >
                            <PlusCircleIcon className="h-5 w-5 shrink-0" />
                            Open a New Account
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
