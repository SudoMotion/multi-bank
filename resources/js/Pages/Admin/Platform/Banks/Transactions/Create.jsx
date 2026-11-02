import TransactionForm from '@/Components/Admin/Platform/TransactionForm';
import { Card } from '@/Components/UI';
import BankWorkspaceLayout from '@/Layouts/Admin/BankWorkspaceLayout';

export default function Create({ workspace, accounts, operations, maxAmount, defaults }) {
    const bankId = workspace.bank.id;

    return (
        <BankWorkspaceLayout
            workspace={workspace}
            title="New transaction"
            description="Deposit, withdraw, transfer or adjust a balance at this bank."
            backHref={route('admin.platform.banks.transactions.index', bankId)}
            backLabel="Back to transactions"
        >
            <Card className="max-w-2xl">
                {accounts.length === 0 ? (
                    <p className="text-sm text-neutral-500">This bank has no open accounts yet.</p>
                ) : (
                    <TransactionForm
                        bankId={bankId}
                        operations={operations}
                        accounts={accounts}
                        defaults={defaults}
                        maxAmount={maxAmount}
                    />
                )}
            </Card>
        </BankWorkspaceLayout>
    );
}
