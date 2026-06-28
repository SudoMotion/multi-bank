import AdminLayout from '@/Layouts/Admin/AdminLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link } from '@inertiajs/react';

export default function Index() {
    return (
        <AdminLayout title="Products">
            <Head title="Products" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your products.
                    </p>
                </div>
                <Link href={route('admin.products.create')}>
                    <PrimaryButton>Add Product</PrimaryButton>
                </Link>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">
                    Product list will be implemented here.
                </p>
            </div>
        </AdminLayout>
    );
}
