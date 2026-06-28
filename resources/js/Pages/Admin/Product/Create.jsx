import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Create() {
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

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Product create form will be implemented here.</p>
            </div>
        </AdminLayout>
    );
}
