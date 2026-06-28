import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import {
    Button,
    Card,
    FileInput,
    FormField,
    Input,
    Radio,
    Textarea,
} from '@/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create() {
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, processing, errors, progress } = useForm({
        title: '',
        description: '',
        image: null,
        status: 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.about-us.store'), {
            forceFormData: true,
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
        <AdminLayout title="Create About Us">
            <Head title="Create About Us" />

            <AdminPageHeader
                title="Create About Us"
                backHref={route('admin.about-us.index')}
                backLabel="Back to about us"
            />

            <AdminForm onSubmit={submit}>
                <Card title="About Us Details">
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
                            onChange={handleImageChange}
                        >
                            {imagePreview && (
                                <div className="mt-3 inline-flex rounded-md border border-neutral-200 bg-neutral-50 p-2">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
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

                    <div className="mt-4 flex justify-end gap-3">
                        <Link href={route('admin.about-us.index')}>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Save Entry
                        </Button>
                    </div>
                </Card>
            </AdminForm>
        </AdminLayout>
    );
}
