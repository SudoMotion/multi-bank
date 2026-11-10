import Modal from '@/Components/Modal';
import { Button, ErrorMessage, Input, Textarea } from '@/Components/UI';

const sectionMeta = {
    address: {
        title: 'Manage Address',
        description: 'Update your home and mailing addresses on file.',
    },
    phone: {
        title: 'Manage Phone',
        description: 'Update your primary phone number.',
    },
    email: {
        title: 'Manage Email',
        description: 'Update your primary email address for online banking.',
    },
};

export default function CustomerProfileEditModal({
    open,
    section,
    data,
    errors,
    processing,
    onChange,
    onClose,
    onSubmit,
}) {
    const meta = section ? sectionMeta[section] : null;

    if (!meta) {
        return null;
    }

    return (
        <Modal show={open} maxWidth="lg" onClose={onClose}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
                className="px-6 py-5 sm:px-8 sm:py-6"
            >
                <h2 className="text-xl font-medium text-neutral-900">{meta.title}</h2>
                <p className="mt-1 text-sm text-neutral-600">{meta.description}</p>

                <div className="mt-6 space-y-4">
                    {section === 'address' && (
                        <>
                            <Textarea
                                id="profile_address"
                                label="Home address"
                                rows={4}
                                value={data.address}
                                error={errors.address}
                                required
                                autoComplete="street-address"
                                className="focus:border-[#006ac3] focus:ring-[#006ac3]"
                                onChange={(e) => onChange('address', e.target.value)}
                            />
                            <Textarea
                                id="profile_mailing_address"
                                label="Mailing address"
                                rows={4}
                                value={data.mailing_address}
                                error={errors.mailing_address}
                                autoComplete="postal-address"
                                className="focus:border-[#006ac3] focus:ring-[#006ac3]"
                                onChange={(e) => onChange('mailing_address', e.target.value)}
                            />
                            <p className="text-xs text-neutral-500">
                                Leave mailing address blank to use your home address on your profile.
                            </p>
                        </>
                    )}

                    {section === 'phone' && (
                        <Input
                            id="profile_phone"
                            label="Home (Primary)"
                            type="tel"
                            value={data.phone}
                            error={errors.phone}
                            required
                            autoComplete="tel"
                            className="focus:border-[#006ac3] focus:ring-[#006ac3]"
                            onChange={(e) => onChange('phone', e.target.value)}
                        />
                    )}

                    {section === 'email' && (
                        <Input
                            id="profile_email"
                            label="Primary email"
                            type="email"
                            value={data.email}
                            error={errors.email}
                            required
                            autoComplete="email"
                            className="focus:border-[#006ac3] focus:ring-[#006ac3]"
                            onChange={(e) => onChange('email', e.target.value)}
                        />
                    )}

                    {errors.section && <ErrorMessage message={errors.section} />}
                </div>

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button type="button" variant="secondary" disabled={processing} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing} className="bg-[#006ac3] hover:bg-[#0058a8]">
                        {processing ? 'Saving…' : 'Save changes'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
