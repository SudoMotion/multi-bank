import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import {
    ActionButtonGroup,
    Button,
    Card,
    DeleteAction,
    EditAction,
    ViewAction,
} from '@/Components/UI';
import { Head, Link } from '@inertiajs/react';

const sampleProducts = [
    { id: 1, name: 'Sample Product A', status: 'Active', price: '$99.00' },
    { id: 2, name: 'Sample Product B', status: 'Draft', price: '$149.00' },
    { id: 3, name: 'Sample Product C', status: 'Active', price: '$79.00' },
];

export default function Index() {
    return (
        <AdminLayout title="Products">
            <Head title="Products" />

            <AdminPageHeader
                title="Products"
                description="Manage your products."
                actions={
                    <Link href={route('admin.products.create')}>
                        <Button>Add Product</Button>
                    </Link>
                }
            />

            <Card bodyClassName="p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 bg-white">
                            {sampleProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-neutral-50/50">
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-neutral-900">
                                        {product.name}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">
                                        {product.status}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">
                                        {product.price}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right">
                                        <ActionButtonGroup className="justify-end">
                                            <ViewAction href={`#product-${product.id}`} />
                                            <EditAction
                                                href={route('admin.products.edit', product.id)}
                                            />
                                            <DeleteAction href={`#delete-${product.id}`} />
                                        </ActionButtonGroup>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </AdminLayout>
    );
}
