import CustomerProfileCard, {
    CardIcon,
    EmailIcon,
    HomeIcon,
    PersonIcon,
    PhoneIcon,
    ProfileField,
} from '@/Components/Customer/CustomerProfileCard';
import CustomerProfileEditModal from '@/Components/Customer/CustomerProfileEditModal';
import CustomerLayout from '@/Layouts/Customer/CustomerLayout';
import { Alert, Button } from '@/Components/UI';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

function CopyIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 011.927-.184"
            />
        </svg>
    );
}

function AccountNumberValue({ formatted, digits }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        if (!digits) {
            return;
        }

        try {
            await navigator.clipboard.writeText(digits);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            const input = document.createElement('textarea');
            input.value = digits;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!formatted) {
        return <p className="text-base text-neutral-500 sm:text-lg">—</p>;
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-base tabular-nums tracking-wide text-neutral-800 sm:text-lg">
                {formatted}
            </span>
            <Button
                type="button"
                variant="secondary"
                className="inline-flex h-9 items-center gap-1.5 border-[#c5d4e3] px-3 text-sm text-[#006ac3] hover:bg-blue-50"
                onClick={copy}
            >
                <CopyIcon className="h-4 w-4" />
                {copied ? 'Copied' : 'Copy'}
            </Button>
        </div>
    );
}

export default function Index({ profile }) {
    const { flash } = usePage().props;
    const [editSection, setEditSection] = useState(null);

    const { data, setData, patch, processing, errors, clearErrors, reset } = useForm({
        section: '',
        address: '',
        mailing_address: '',
        phone: '',
        email: '',
    });

    const displayName = profile.display_name || profile.name || '—';
    const homeAddress = profile.home_address || profile.address;
    const mailingAddress = profile.mailing_address || homeAddress;

    const openEdit = (section) => {
        clearErrors();
        setData({
            section,
            address: profile.address ?? '',
            mailing_address: profile.mailing_address ?? '',
            phone: profile.phone ?? '',
            email: profile.email ?? '',
        });
        setEditSection(section);
    };

    const closeEdit = () => {
        setEditSection(null);
        clearErrors();
        reset();
    };

    const saveProfile = () => {
        patch(route('customer.profile.update'), {
            preserveScroll: true,
            onSuccess: () => closeEdit(),
        });
    };

    const handleFieldChange = (field, value) => {
        setData(field, value);
    };

    return (
        <CustomerLayout
            current="profile"
            title="Profile"
            contentClassName="mx-auto max-w-2xl"
        >
            <Head title="Your Profile" />

            {flash?.success && (
                <Alert variant="success" className="mb-5">
                    {flash.success}
                </Alert>
            )}

            <h1 className="mb-6 text-center text-2xl font-light tracking-tight text-neutral-900 sm:mb-8 sm:text-3xl">
                Your Profile
            </h1>

            <div className="space-y-4 sm:space-y-5">
                <CustomerProfileCard icon={PersonIcon} title="Name" showManage={false}>
                    <ProfileField value={displayName} uppercase />
                </CustomerProfileCard>

                <CustomerProfileCard
                    icon={HomeIcon}
                    title="Address"
                    onManage={() => openEdit('address')}
                >
                    <ProfileField label="Home Address" value={homeAddress} uppercase />
                    <ProfileField label="Mailing Address" value={mailingAddress} uppercase />
                </CustomerProfileCard>

                <CustomerProfileCard icon={PhoneIcon} title="Phone" onManage={() => openEdit('phone')}>
                    <ProfileField label="Home (Primary)" value={profile.phone} />
                </CustomerProfileCard>

                <CustomerProfileCard icon={EmailIcon} title="Email" onManage={() => openEdit('email')}>
                    <ProfileField label="Primary" value={profile.email} />
                </CustomerProfileCard>

                <CustomerProfileCard icon={CardIcon} title="Account number" showManage={false}>
                    <p className="text-sm text-neutral-600 sm:text-base">Online banking number</p>
                    <div className="mt-1">
                        <AccountNumberValue
                            formatted={profile.account_number}
                            digits={profile.account_number_digits}
                        />
                    </div>
                </CustomerProfileCard>
            </div>

            <CustomerProfileEditModal
                open={editSection !== null}
                section={editSection}
                data={data}
                errors={errors}
                processing={processing}
                onChange={handleFieldChange}
                onClose={closeEdit}
                onSubmit={saveProfile}
            />
        </CustomerLayout>
    );
}
