import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
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

export default function Edit({ productId }) {
    const { data, setData, processing, errors } = useForm({
        name: `Sample Product ${productId}`,
        sku: `SKU-${productId}`,
        category: 'furniture',
        status: 'active',
        price: '99.00',
        featured: true,
        description: 'Sample product description.',
    });

    const submit = (e) => {
        e.preventDefault();
    };

    return (
        <AdminLayout title="Edit Product">
            <Head title="Edit Product" />

            <AdminPageHeader
                title="Edit Product"
                backHref={route('admin.products.index')}
                backLabel="Back to products"
            />

            <AdminForm onSubmit={submit}>
                <Card title="Product Details">
                    <AdminFormGrid>
                        <Input
                            id="name"
                            label="Product Name"
                            wrapperClassName="sm:col-span-2"
                            value={data.name}
                            error={errors.name}
                            required
                            onChange={(e) => setData('name', e.target.value)}
                        />

                        <Input
                            id="sku"
                            label="SKU"
                            value={data.sku}
                            error={errors.sku}
                            onChange={(e) => setData('sku', e.target.value)}
                        />

                        <Select
                            id="category"
                            label="Category"
                            value={data.category}
                            options={[
                                { value: 'furniture', label: 'Furniture' },
                                { value: 'lighting', label: 'Lighting' },
                                { value: 'decor', label: 'Decor' },
                            ]}
                            error={errors.category}
                            onChange={(e) => setData('category', e.target.value)}
                        />

                        <Input
                            id="price"
                            label="Price"
                            type="number"
                            value={data.price}
                            error={errors.price}
                            onChange={(e) => setData('price', e.target.value)}
                        />

                        <FormField label="Status" error={errors.status} className="sm:col-span-2">
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

                        <div className="sm:col-span-2">
                            <Checkbox
                                id="featured"
                                label="Featured product"
                                checked={data.featured}
                                onChange={(e) => setData('featured', e.target.checked)}
                            />
                        </div>

                        <Textarea
                            id="description"
                            label="Description"
                            wrapperClassName="sm:col-span-2"
                            value={data.description}
                            error={errors.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </AdminFormGrid>

                    <div className="mt-4 flex justify-end gap-3">
                        <Link href={route('admin.products.index')}>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Update Product
                        </Button>
                    </div>
                </Card>
            </AdminForm>
        </AdminLayout>
    );
}
