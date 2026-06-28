import AdminLayout from '@/Layouts/Admin/AdminLayout';
import {
    Button,
    Card,
    Checkbox,
    FormField,
    Input,
    Radio,
    Select,
    Textarea,
} from '@/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, processing, errors } = useForm({
        name: '',
        sku: '',
        category: '',
        status: 'active',
        price: '',
        featured: false,
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();
    };

    return (
        <AdminLayout title="Create Product">
            <Head title="Create Product" />

            <div className="mb-6">
                <Link
                    href={route('admin.products.index')}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                    &larr; Back to products
                </Link>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">Create Product</h2>
            </div>

            <form onSubmit={submit}>
                <Card title="Product Details">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                            className="sm:col-span-2"
                            label="Product Name"
                            htmlFor="name"
                            error={errors.name}
                            required
                        >
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </FormField>

                        <FormField label="SKU" htmlFor="sku" error={errors.sku}>
                            <Input
                                id="sku"
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                            />
                        </FormField>

                        <FormField label="Category" htmlFor="category" error={errors.category}>
                            <Select
                                id="category"
                                value={data.category}
                                placeholder="Select category"
                                options={[
                                    { value: 'furniture', label: 'Furniture' },
                                    { value: 'lighting', label: 'Lighting' },
                                    { value: 'decor', label: 'Decor' },
                                ]}
                                onChange={(e) => setData('category', e.target.value)}
                            />
                        </FormField>

                        <FormField label="Price" htmlFor="price" error={errors.price}>
                            <Input
                                id="price"
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                            />
                        </FormField>

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
                                    id="status_draft"
                                    name="status"
                                    value="draft"
                                    label="Draft"
                                    checked={data.status === 'draft'}
                                    onChange={() => setData('status', 'draft')}
                                />
                            </div>
                        </FormField>

                        <FormField className="sm:col-span-2">
                            <Checkbox
                                id="featured"
                                label="Featured product"
                                checked={data.featured}
                                onChange={(e) => setData('featured', e.target.checked)}
                            />
                        </FormField>

                        <FormField
                            className="sm:col-span-2"
                            label="Description"
                            htmlFor="description"
                            error={errors.description}
                        >
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </FormField>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Link href={route('admin.products.index')}>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Save Product
                        </Button>
                    </div>
                </Card>
            </form>
        </AdminLayout>
    );
}
