import AdminLayout from '@/Layouts/Admin/AdminLayout';
import {
    Alert,
    Button,
    Card,
    FileInput,
    Input,
    Textarea,
} from '@/Components/UI';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ settings }) {
    const { flash } = usePage().props;
    const [logoPreview, setLogoPreview] = useState(settings.logo_url);

    const { data, setData, post, processing, errors, progress } = useForm({
        application_name: settings.application_name ?? '',
        email: settings.email ?? '',
        phone: settings.phone ?? '',
        logo: null,
        address: settings.address ?? '',
        google_map_embed_link: settings.google_map_embed_link ?? '',
        social_media: settings.social_media?.length
            ? settings.social_media
            : [{ platform: '', url: '' }],
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('admin.settings.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const addSocialMedia = () => {
        setData('social_media', [...data.social_media, { platform: '', url: '' }]);
    };

    const removeSocialMedia = (index) => {
        setData(
            'social_media',
            data.social_media.filter((_, i) => i !== index),
        );
    };

    const updateSocialMedia = (index, field, value) => {
        const updated = [...data.social_media];
        updated[index] = { ...updated[index], [field]: value };
        setData('social_media', updated);
    };

    return (
        <AdminLayout title="Settings">
            <Head title="Settings" />

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Manage application settings and contact information.
                </p>
            </div>

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            <form onSubmit={submit} className="space-y-6">
                <Card title="General Information">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                            id="application_name"
                            label="Application Name"
                            wrapperClassName="sm:col-span-2"
                            value={data.application_name}
                            error={errors.application_name}
                            onChange={(e) => setData('application_name', e.target.value)}
                        />

                        <Input
                            id="email"
                            label="Email"
                            type="email"
                            value={data.email}
                            error={errors.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <Input
                            id="phone"
                            label="Phone"
                            value={data.phone}
                            error={errors.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                        />

                        <Textarea
                            id="address"
                            label="Address"
                            wrapperClassName="sm:col-span-2"
                            value={data.address}
                            error={errors.address}
                            onChange={(e) => setData('address', e.target.value)}
                        />

                        <FileInput
                            id="logo"
                            label="Logo"
                            wrapperClassName="sm:col-span-2"
                            accept="image/*"
                            error={errors.logo}
                            onChange={handleLogoChange}
                        >
                            {logoPreview && (
                                <img
                                    src={logoPreview}
                                    alt="Logo preview"
                                    className="mt-3 h-20 w-auto rounded border border-gray-200 object-contain p-1"
                                />
                            )}
                            {progress && (
                                <p className="mt-2 text-sm text-gray-500">
                                    Uploading: {progress.percentage}%
                                </p>
                            )}
                        </FileInput>

                        <Input
                            id="google_map_embed_link"
                            label="Google Map Embed Link"
                            wrapperClassName="sm:col-span-2"
                            value={data.google_map_embed_link}
                            placeholder="https://www.google.com/maps/embed?..."
                            error={errors.google_map_embed_link}
                            onChange={(e) =>
                                setData('google_map_embed_link', e.target.value)
                            }
                        />
                    </div>
                </Card>

                <Card
                    title="Social Media"
                    actions={
                        <Button type="button" variant="secondary" onClick={addSocialMedia}>
                            Add Link
                        </Button>
                    }
                >
                    <div className="space-y-4">
                        {data.social_media.map((item, index) => (
                            <div
                                key={index}
                                className="grid gap-4 rounded-md border border-gray-100 bg-gray-50 p-4 sm:grid-cols-2"
                            >
                                <Input
                                    id={`social_platform_${index}`}
                                    label="Platform"
                                    value={item.platform}
                                    placeholder="Facebook, Instagram, etc."
                                    error={errors[`social_media.${index}.platform`]}
                                    onChange={(e) =>
                                        updateSocialMedia(index, 'platform', e.target.value)
                                    }
                                />

                                <Input
                                    id={`social_url_${index}`}
                                    label="URL"
                                    value={item.url}
                                    placeholder="https://..."
                                    error={errors[`social_media.${index}.url`]}
                                    onChange={(e) =>
                                        updateSocialMedia(index, 'url', e.target.value)
                                    }
                                />

                                {data.social_media.length > 1 && (
                                    <div className="sm:col-span-2 flex justify-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => removeSocialMedia(index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={processing}>
                        Save Settings
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
