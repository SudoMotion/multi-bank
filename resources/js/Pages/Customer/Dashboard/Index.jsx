import { Card } from '@/Components/UI';
import CustomerLayout from '@/Layouts/Customer/CustomerLayout';
import { Head } from '@inertiajs/react';

export default function Index({ customer, accounts, transactions }) {
    return (
        <CustomerLayout title={`Welcome, ${customer.name}`}>
            <Head title="Dashboard" />

            <p className="mb-8 text-sm text-neutral-600">
                Account number{' '}
                <span className="font-mono font-medium text-neutral-900">{customer.account_number}</span>
            </p>

            <section className="mb-10">
                <h2 className="mb-4 text-lg font-semibold text-neutral-900">Your accounts</h2>
                {accounts.length === 0 ? (
                    <Card>
                        <p className="text-sm text-neutral-600">
                            You do not have any accounts yet. Visit a branch to open an account.
                        </p>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {accounts.map((account) => (
                            <Card key={account.id} title={account.label}>
                                <p className="text-2xl font-semibold text-neutral-900">{account.balance_formatted}</p>
                                <p className="mt-2 text-xs uppercase tracking-wide text-neutral-500">
                                    {account.status} · {account.currency}
                                </p>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h2 className="mb-4 text-lg font-semibold text-neutral-900">Recent activity</h2>
                {transactions.length === 0 ? (
                    <Card>
                        <p className="text-sm text-neutral-600">No transactions to show.</p>
                    </Card>
                ) : (
                    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
                        <table className="min-w-full divide-y divide-neutral-200 text-sm">
                            <thead className="bg-neutral-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-neutral-600">Date</th>
                                    <th className="px-4 py-3 text-left font-medium text-neutral-600">Account</th>
                                    <th className="px-4 py-3 text-left font-medium text-neutral-600">Description</th>
                                    <th className="px-4 py-3 text-right font-medium text-neutral-600">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {transactions.map((txn) => (
                                    <tr key={txn.id}>
                                        <td className="whitespace-nowrap px-4 py-3 text-neutral-700">
                                            {txn.created_at
                                                ? new Date(txn.created_at).toLocaleDateString()
                                                : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-neutral-700">{txn.account_label}</td>
                                        <td className="px-4 py-3 text-neutral-700">
                                            {txn.description || txn.type}
                                        </td>
                                        <td
                                            className={
                                                'whitespace-nowrap px-4 py-3 text-right font-medium ' +
                                                (txn.amount.startsWith('-')
                                                    ? 'text-red-700'
                                                    : 'text-emerald-700')
                                            }
                                        >
                                            {txn.amount_formatted}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </CustomerLayout>
    );
}
