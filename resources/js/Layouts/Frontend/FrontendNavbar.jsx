import Container from '@/Components/Frontend/Container';
import { themeable } from '@/tenancy/theme';
import { useTenant } from '@/tenancy/useTenant';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const centralLinks = [
    { name: 'Banks', href: 'home', hash: '#member-banks' },
    { name: 'Calculator', href: 'home', hash: '#calculator' },
    { name: 'Contact', href: 'contact' },
];

const tenantLinks = [
    { name: 'Home', href: 'home' },
    { name: 'About', href: 'about' },
    { name: 'Contact', href: 'contact' },
];

function linkHref(link) {
    return link.hash ? `${route(link.href)}${link.hash}` : route(link.href);
}

function CentralBrand() {
    const { site, landing } = usePage().props;

    return (
        <>
            <img
                src={site.logo_url ?? '/images/cdic-logo.svg'}
                alt=""
                className="h-10 w-10 shrink-0 object-contain"
            />
            <span className="hidden text-sm font-semibold leading-snug text-brand-purple sm:block sm:max-w-[14rem] md:max-w-none lg:text-base">
                {landing?.brand_title ?? site.name}
            </span>
            <span className="text-sm font-semibold text-brand-purple sm:hidden">{site.name}</span>
        </>
    );
}

function TenantBrand() {
    const { site } = usePage().props;

    return site.logo_url ? (
        <img src={site.logo_url} alt={site.name} className="h-9 w-auto max-w-[180px] object-contain" />
    ) : (
        <span className="text-lg font-semibold text-tenant-primary">{site.name}</span>
    );
}

function SignInButton({ url, className = '' }) {
    if (!url) {
        return null;
    }

    return (
        <a
            href={url}
            className={
                'inline-flex items-center justify-center rounded-full bg-tenant-primary px-4 py-2 text-sm font-semibold text-tenant-on-primary transition hover:opacity-90 ' +
                className
            }
        >
            Sign in
        </a>
    );
}

function FrontendNavbar() {
    const tenant = useTenant();
    const { landing } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    const links = tenant
        ? tenantLinks
        : centralLinks.filter((link) => link.hash !== '#calculator' || landing?.show_calculator);
    const signInUrl = tenant?.settings?.online_banking_url;
    const linkClassName = tenant
        ? 'text-sm font-medium text-neutral-700 transition hover:text-tenant-primary'
        : 'text-sm font-medium text-neutral-700 transition hover:text-brand-purple';

    return (
        <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
            <Container>
                <div className="flex h-[72px] items-center justify-between gap-4">
                    <Link href={route('home')} className="flex min-w-0 items-center gap-3">
                        {tenant ? <TenantBrand /> : <CentralBrand />}
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        {links.map((link) => (
                            <Link key={link.name} href={linkHref(link)} className={linkClassName}>
                                {link.name}
                            </Link>
                        ))}
                        {tenant ? (
                            <SignInButton url={signInUrl} />
                        ) : (
                            <button type="button" className={linkClassName} aria-label="Switch to French">
                                FR
                            </button>
                        )}
                    </nav>

                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-100 md:hidden"
                        onClick={() => setMobileOpen((open) => !open)}
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {mobileOpen && (
                    <nav className="border-t border-neutral-100 py-3 md:hidden">
                        <div className="flex flex-col gap-1">
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    href={linkHref(link)}
                                    className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {tenant ? (
                                <SignInButton url={signInUrl} className="mx-3 mt-2" />
                            ) : (
                                <span className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700">
                                    FR
                                </span>
                            )}
                        </div>
                    </nav>
                )}
            </Container>
        </header>
    );
}

export default themeable('Layouts/Frontend/FrontendNavbar', FrontendNavbar);
