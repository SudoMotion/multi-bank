import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import {
    Alert,
    Button,
    Card,
    FileInput,
    FormField,
    Input,
    Radio,
    Textarea,
} from '@/Components/UI';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ aboutUs }) {
    const { flash } = usePage().props;
    const [imagePreview, setImagePreview] = useState(aboutUs.image_url);

    const { data, setData, post, processing, errors, progress } = useForm({
        title: aboutUs.title ?? '',
        description: aboutUs.description ?? '',
        image: null,
        status: aboutUs.status ?? 'active',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('admin.about-us.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <AdminLayout title="About Us">
            <Head title="About Us" />

            <AdminPageHeader
                title="About Us"
                description="Manage the about us page content."
            />

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            <AdminForm onSubmit={submit}>
                <Card title="About Us Content">
                    <AdminFormGrid>
                        <Input
                            id="title"
                            label="Title"
                            wrapperClassName="sm:col-span-2 lg:col-span-2 xl:col-span-2"
                            value={data.title}
                            error={errors.title}
                            required
                            onChange={(e) => setData('title', e.target.value)}
                        />

                        <FormField label="Status" error={errors.status}>
                            <div className="flex flex-wrap gap-4 pt-1">
                                <Radio
                                    id="status_active"
                                    name="status"
                                    value="active"
                                    label="Active"
                                    checked={data.status === 'active'}
                                    onChange={() => setData('status', 'active')}
                                />
                                <Radio
                                    id="status_inactive"
                                    name="status"
                                    value="inactive"
                                    label="Inactive"
                                    checked={data.status === 'inactive'}
                                    onChange={() => setData('status', 'inactive')}
                                />
                            </div>
                        </FormField>

                        <Textarea
                            id="description"
                            label="Description"
                            wrapperClassName="sm:col-span-2 lg:col-span-3 xl:col-span-4"
                            value={data.description}
                            error={errors.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />

                        <FileInput
                            id="image"
                            label="Image"
                            wrapperClassName="sm:col-span-2 lg:col-span-2 xl:col-span-2"
                            accept="image/*"
                            error={errors.image}
                            hint="PNG, JPG or WebP. Max 2MB."
                            placeholder={imagePreview ? 'Replace current image' : 'No file chosen'}
                            onChange={handleImageChange}
                        >
                            {imagePreview && (
                                <div className="mt-3 inline-flex rounded-md border border-neutral-200 bg-neutral-50 p-2">
                                    <img
                                        src={imagePreview}
                                        alt="About us preview"
                                        className="h-20 w-auto max-w-[200px] object-contain"
                                    />
                                </div>
                            )}
                            {progress && (
                                <p className="mt-2 text-sm text-neutral-500">
                                    Uploading: {progress.percentage}%
                                </p>
                            )}
                        </FileInput>
                    </AdminFormGrid>

                    <div className="mt-4 flex justify-end">
                        <Button type="submit" disabled={processing}>
                            Save About Us
                        </Button>
                    </div>
                </Card>
            </AdminForm>
        </AdminLayout>
    );
}
