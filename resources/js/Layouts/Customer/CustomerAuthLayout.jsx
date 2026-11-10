import Container from '@/Components/Frontend/Container';
import SiteFavicon from '@/Components/SiteFavicon';
import { Link, usePage } from '@inertiajs/react';

export default function CustomerAuthLayout({ title, children }) {
    const { site, tenant } = usePage().props;

    return (
        <div className="flex min-h-screen flex-col bg-neutral-50">
            <SiteFavicon />
            <header className="border-b border-neutral-200 bg-white">
                <Container className="flex h-16 items-center justify-between gap-4">
                    <Link href={route('home')} className="flex min-w-0 items-center gap-3">
                        {site.logo_url ? (
                            <img
                                src={site.logo_url}
                                alt={site.name}
                                className="h-9 w-auto max-w-[180px] object-contain"
                            />
                        ) : (
                            <span className="text-lg font-semibold text-tenant-primary">{site.name}</span>
                        )}
                    </Link>
                    <p className="hidden text-sm text-neutral-600 sm:block">Online banking</p>
                </Container>
            </header>

            <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
                <div className="w-full max-w-md">
                    {title && (
                        <h1 className="mb-6 text-center text-2xl font-semibold text-neutral-900">{title}</h1>
                    )}
                    <div className="rounded-lg border border-neutral-200 bg-white px-6 py-6 shadow-sm">
                        {children}
                    </div>
                    {tenant?.tagline && (
                        <p className="mt-6 text-center text-sm text-neutral-500">{tenant.tagline}</p>
                    )}
                </div>
            </main>
        </div>
    );
}
