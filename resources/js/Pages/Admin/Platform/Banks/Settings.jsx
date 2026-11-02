import SiteSettingsForm from '@/Components/Admin/SiteSettingsForm';
import BankWorkspaceLayout from '@/Layouts/Admin/BankWorkspaceLayout';

export default function Settings({ workspace, settings }) {
    return (
        <BankWorkspaceLayout
            workspace={workspace}
            title="Site Settings"
            description="This bank's own site name, contact details, logo and social links — the same settings its bank admin sees. Global settings are not affected."
        >
            <SiteSettingsForm
                settings={settings}
                submitUrl={route('admin.platform.banks.settings.update', workspace.bank.id)}
            />
        </BankWorkspaceLayout>
    );
}
