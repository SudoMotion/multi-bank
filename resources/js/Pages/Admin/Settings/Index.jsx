import AdminLayout from '@/Layouts/Admin/AdminLayout';
import {
    Alert,
    Button,
    Card,
    FileInput,
    FormField,
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
                        <FormField
                            className="sm:col-span-2"
                            label="Application Name"
                            htmlFor="application_name"
                            error={errors.application_name}
                        >
                            <Input
                                id="application_name"
                                value={data.application_name}
                                onChange={(e) => setData('application_name', e.target.value)}
                            />
                        </FormField>

                        <FormField label="Email" htmlFor="email" error={errors.email}>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </FormField>

                        <FormField label="Phone" htmlFor="phone" error={errors.phone}>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                        </FormField>

                        <FormField
                            className="sm:col-span-2"
                            label="Address"
                            htmlFor="address"
                            error={errors.address}
                        >
                            <Textarea
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                            />
                        </FormField>

                        <FormField
                            className="sm:col-span-2"
                            label="Logo"
                            htmlFor="logo"
                            error={errors.logo}
                        >
                            <FileInput
                                id="logo"
                                accept="image/*"
                                onChange={handleLogoChange}
                            />
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
                        </FormField>

                        <FormField
                            className="sm:col-span-2"
                            label="Google Map Embed Link"
                            htmlFor="google_map_embed_link"
                            error={errors.google_map_embed_link}
                        >
                            <Input
                                id="google_map_embed_link"
                                value={data.google_map_embed_link}
                                placeholder="https://www.google.com/maps/embed?..."
                                onChange={(e) =>
                                    setData('google_map_embed_link', e.target.value)
                                }
                            />
                        </FormField>
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
                                <FormField
                                    label="Platform"
                                    htmlFor={`social_platform_${index}`}
                                    error={errors[`social_media.${index}.platform`]}
                                >
                                    <Input
                                        id={`social_platform_${index}`}
                                        value={item.platform}
                                        placeholder="Facebook, Instagram, etc."
                                        onChange={(e) =>
                                            updateSocialMedia(index, 'platform', e.target.value)
                                        }
                                    />
                                </FormField>

                                <FormField
                                    label="URL"
                                    htmlFor={`social_url_${index}`}
                                    error={errors[`social_media.${index}.url`]}
                                >
                                    <div className="flex gap-2">
                                        <Input
                                            id={`social_url_${index}`}
                                            value={item.url}
                                            placeholder="https://..."
                                            onChange={(e) =>
                                                updateSocialMedia(index, 'url', e.target.value)
                                            }
                                        />
                                        {data.social_media.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => removeSocialMedia(index)}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                </FormField>
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
