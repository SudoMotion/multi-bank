import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
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
                <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">
                    {flash.success}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                        General Information
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="application_name" value="Application Name" />
                            <TextInput
                                id="application_name"
                                value={data.application_name}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('application_name', e.target.value)}
                            />
                            <InputError message={errors.application_name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="phone" value="Phone" />
                            <TextInput
                                id="phone"
                                value={data.phone}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            <InputError message={errors.phone} className="mt-2" />
                        </div>

                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="address" value="Address" />
                            <textarea
                                id="address"
                                rows={3}
                                value={data.address}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                onChange={(e) => setData('address', e.target.value)}
                            />
                            <InputError message={errors.address} className="mt-2" />
                        </div>

                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="logo" value="Logo" />
                            <input
                                id="logo"
                                type="file"
                                accept="image/*"
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                                onChange={handleLogoChange}
                            />
                            {logoPreview && (
                                <img
                                    src={logoPreview}
                                    alt="Logo preview"
                                    className="mt-3 h-20 w-auto rounded border border-gray-200 object-contain p-1"
                                />
                            )}
                            <InputError message={errors.logo} className="mt-2" />
                            {progress && (
                                <p className="mt-2 text-sm text-gray-500">
                                    Uploading: {progress.percentage}%
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <InputLabel
                                htmlFor="google_map_embed_link"
                                value="Google Map Embed Link"
                            />
                            <TextInput
                                id="google_map_embed_link"
                                value={data.google_map_embed_link}
                                className="mt-1 block w-full"
                                placeholder="https://www.google.com/maps/embed?..."
                                onChange={(e) =>
                                    setData('google_map_embed_link', e.target.value)
                                }
                            />
                            <InputError
                                message={errors.google_map_embed_link}
                                className="mt-2"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Social Media
                        </h3>
                        <SecondaryButton type="button" onClick={addSocialMedia}>
                            Add Link
                        </SecondaryButton>
                    </div>

                    <div className="space-y-4">
                        {data.social_media.map((item, index) => (
                            <div
                                key={index}
                                className="grid gap-4 rounded-md border border-gray-100 bg-gray-50 p-4 sm:grid-cols-2"
                            >
                                <div>
                                    <InputLabel
                                        htmlFor={`social_platform_${index}`}
                                        value="Platform"
                                    />
                                    <TextInput
                                        id={`social_platform_${index}`}
                                        value={item.platform}
                                        className="mt-1 block w-full"
                                        placeholder="Facebook, Instagram, etc."
                                        onChange={(e) =>
                                            updateSocialMedia(
                                                index,
                                                'platform',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors[`social_media.${index}.platform`]}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor={`social_url_${index}`}
                                        value="URL"
                                    />
                                    <div className="mt-1 flex gap-2">
                                        <TextInput
                                            id={`social_url_${index}`}
                                            value={item.url}
                                            className="block w-full"
                                            placeholder="https://..."
                                            onChange={(e) =>
                                                updateSocialMedia(
                                                    index,
                                                    'url',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {data.social_media.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSocialMedia(index)}
                                                className="shrink-0 rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <InputError
                                        message={errors[`social_media.${index}.url`]}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <PrimaryButton disabled={processing}>Save Settings</PrimaryButton>
                </div>
            </form>
        </AdminLayout>
    );
}
