import CustomerTransactionForm from '@/Components/Admin/Platform/CustomerTransactionForm';
import { Card } from '@/Components/UI';
import BankWorkspaceLayout from '@/Layouts/Admin/BankWorkspaceLayout';

export default function Create({
    workspace,
    accounts,
    customer,
    transactionTypes,
    transactionStatuses,
    maxAmount,
    defaults,
}) {
    const bankId = workspace.bank.id;

    const backHref = customer
        ? route('admin.platform.banks.customers.transactions.index', [bankId, customer.id])
        : route('admin.platform.banks.transactions.index', bankId);

    const backLabel = customer ? `Back to ${customer.name} transactions` : 'Back to transactions';

    return (
        <BankWorkspaceLayout
            workspace={workspace}
            title={customer ? `New transaction — ${customer.name}` : 'New transaction'}
            description="Deposit, withdrawal, refund or fee. Balance updates when status is Complete."
            backHref={backHref}
            backLabel={backLabel}
        >
            <Card className="max-w-2xl">
                {accounts.length === 0 ? (
                    <p className="text-sm text-neutral-500">
                        {customer
                            ? 'This customer has no open accounts. Assign or open an account first.'
                            : 'This bank has no open accounts yet.'}
                    </p>
                ) : (
                    <>
                        {maxAmount && (
                            <p className="mb-4 text-xs text-neutral-500">
                                Platform limit: {maxAmount} per transaction.
                            </p>
                        )}
                        <CustomerTransactionForm
                            accounts={accounts}
                            transactionTypes={transactionTypes}
                            transactionStatuses={transactionStatuses}
                            submitUrl={route('admin.platform.banks.transactions.entry.store', bankId)}
                            defaults={defaults}
                            returnTo={customer ? 'customer_transactions' : 'transactions'}
                            customerId={customer?.id ?? ''}
                        />
                    </>
                )}
            </Card>
        </BankWorkspaceLayout>
    );
}
