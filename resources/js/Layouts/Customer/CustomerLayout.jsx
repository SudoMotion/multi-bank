import Container from '@/Components/Frontend/Container';
import SiteFavicon from '@/Components/SiteFavicon';
import { themeable } from '@/tenancy/theme';
import { Link, useForm, usePage } from '@inertiajs/react';

function DefaultCustomerLayout({ title, children }) {
    const { site, auth } = usePage().props;
    const logout = useForm({});

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
                    <nav className="flex items-center gap-4">
                        <Link
                            href={route('customer.dashboard')}
                            className="text-sm font-medium text-neutral-700 hover:text-tenant-primary"
                        >
                            Dashboard
                        </Link>
                        <span className="hidden text-sm text-neutral-500 sm:inline">{auth.customer?.name}</span>
                        <button
                            type="button"
                            className="rounded-full bg-tenant-primary px-4 py-2 text-sm font-semibold text-tenant-on-primary hover:opacity-90"
                            onClick={() => logout.post(route('customer.logout'))}
                            disabled={logout.processing}
                        >
                            Sign out
                        </button>
                    </nav>
                </Container>
            </header>

            <main className="flex-1 py-8">
                <Container>
                    {title && <h1 className="mb-6 text-2xl font-semibold text-neutral-900">{title}</h1>}
                    {children}
                </Container>
            </main>
        </div>
    );
}

export default themeable('Layouts/Customer/CustomerLayout', DefaultCustomerLayout);
