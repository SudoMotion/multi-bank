import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { getSocialMediaPlatformOptions } from '@/constants/socialMediaPlatforms';
import {
    Alert,
    AddAction,
    Button,
    Card,
    FileInput,
    Input,
    RemoveAction,
    Select,
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

            <AdminPageHeader
                title="Settings"
                description="Manage application settings and contact information."
            />

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            <AdminForm onSubmit={submit} className="space-y-4">
                <Card title="General Information">
                    <AdminFormGrid>
                        <Input
                            id="application_name"
                            label="Application Name"
                            wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-2"
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
                            wrapperClassName="sm:col-span-2 lg:col-span-3 xl:col-span-4"
                            value={data.address}
                            error={errors.address}
                            onChange={(e) => setData('address', e.target.value)}
                        />

                        <FileInput
                            id="logo"
                            label="Logo"
                            wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-2"
                            accept="image/*"
                            error={errors.logo}
                            hint="PNG, JPG or SVG. Max 2MB."
                            placeholder={logoPreview ? 'Replace current logo' : 'No file chosen'}
                            onChange={handleLogoChange}
                        >
                            {logoPreview && (
                                <div className="mt-3 inline-flex rounded-md border border-neutral-200 bg-neutral-50 p-2">
                                    <img
                                        src={logoPreview}
                                        alt="Logo preview"
                                        className="h-16 w-auto max-w-[200px] object-contain"
                                    />
                                </div>
                            )}
                            {progress && (
                                <p className="mt-2 text-sm text-neutral-500">
                                    Uploading: {progress.percentage}%
                                </p>
                            )}
                        </FileInput>

                        <Input
                            id="google_map_embed_link"
                            label="Google Map Embed Link"
                            wrapperClassName="sm:col-span-2 lg:col-span-2 xl:col-span-2"
                            value={data.google_map_embed_link}
                            placeholder="https://www.google.com/maps/embed?..."
                            error={errors.google_map_embed_link}
                            onChange={(e) =>
                                setData('google_map_embed_link', e.target.value)
                            }
                        />
                    </AdminFormGrid>
                </Card>

                <Card
                    title="Social Media"
                    actions={
                        <AddAction title="Add social link" onClick={addSocialMedia}>
                            Add Link
                        </AddAction>
                    }
                >
                    <div className="space-y-3">
                        {data.social_media.map((item, index) => (
                            <AdminFormGrid
                                key={index}
                                className="items-end rounded-md border border-neutral-200 bg-neutral-50/50 p-3"
                            >
                                <Select
                                    id={`social_platform_${index}`}
                                    label="Platform"
                                    wrapperClassName="lg:col-span-1 xl:col-span-1"
                                    value={item.platform}
                                    placeholder="Select platform"
                                    options={getSocialMediaPlatformOptions(item.platform)}
                                    error={errors[`social_media.${index}.platform`]}
                                    onChange={(e) =>
                                        updateSocialMedia(index, 'platform', e.target.value)
                                    }
                                />

                                <Input
                                    id={`social_url_${index}`}
                                    label="URL"
                                    wrapperClassName={
                                        data.social_media.length > 1
                                            ? 'sm:col-span-2 lg:col-span-2 xl:col-span-2'
                                            : 'sm:col-span-2 lg:col-span-2 xl:col-span-3'
                                    }
                                    value={item.url}
                                    placeholder="https://..."
                                    error={errors[`social_media.${index}.url`]}
                                    onChange={(e) =>
                                        updateSocialMedia(index, 'url', e.target.value)
                                    }
                                />

                                {data.social_media.length > 1 && (
                                    <div className="flex items-end justify-end lg:col-span-1 xl:col-span-1">
                                        <RemoveAction
                                            title="Remove social link"
                                            onClick={() => removeSocialMedia(index)}
                                        />
                                    </div>
                                )}
                            </AdminFormGrid>
                        ))}
                    </div>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={processing}>
                        Save Settings
                    </Button>
                </div>
            </AdminForm>
        </AdminLayout>
    );
}
