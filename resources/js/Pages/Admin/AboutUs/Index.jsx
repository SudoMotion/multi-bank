import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import {
    ActionButtonGroup,
    Alert,
    Button,
    Card,
    DeleteAction,
    EditAction,
} from '@/Components/UI';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ entries, can }) {
    const { flash } = usePage().props;

    return (
        <AdminLayout title="About Us">
            <Head title="About Us" />

            <AdminPageHeader
                title="About Us"
                description="Manage about us content sections."
                actions={
                    can.create ? (
                        <Link href={route('admin.about-us.create')}>
                            <Button>Add Entry</Button>
                        </Link>
                    ) : null
                }
            />

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            <Card bodyClassName="p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Image
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Title
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Status
                                </th>
                                <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-neutral-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 bg-white">
                            {entries.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-8 text-center text-sm text-neutral-500"
                                    >
                                        No about us entries yet.
                                    </td>
                                </tr>
                            ) : (
                                entries.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-neutral-50/50">
                                        <td className="whitespace-nowrap px-4 py-3">
                                            {entry.image_url ? (
                                                <img
                                                    src={entry.image_url}
                                                    alt={entry.title}
                                                    className="h-10 w-10 rounded border border-neutral-200 object-cover"
                                                />
                                            ) : (
                                                <span className="text-sm text-neutral-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-neutral-900">
                                            {entry.title}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm capitalize text-neutral-600">
                                            {entry.status}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            <ActionButtonGroup className="justify-end">
                                                {can.edit && (
                                                    <EditAction
                                                        href={route(
                                                            'admin.about-us.edit',
                                                            entry.id,
                                                        )}
                                                    />
                                                )}
                                                {can.delete && (
                                                    <DeleteAction
                                                        href={route(
                                                            'admin.about-us.destroy',
                                                            entry.id,
                                                        )}
                                                    />
                                                )}
                                            </ActionButtonGroup>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </AdminLayout>
    );
}
