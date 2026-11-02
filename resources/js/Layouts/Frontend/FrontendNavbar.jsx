import Container from '@/Components/Frontend/Container';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const navLinks = [
    { name: 'Banks', href: 'home', hash: '#member-banks' },
    { name: 'Calculator', href: 'home', hash: '#calculator' },
    { name: 'Contact', href: 'contact' },
];

export default function FrontendNavbar() {
    const { site } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    const linkHref = (link) => {
        if (link.hash) {
            return `${route(link.href)}${link.hash}`;
        }

        return route(link.href);
    };

    const logoSrc = site.logo_url ?? '/images/cdic-logo.svg';

    return (
        <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
            <Container>
                <div className="flex h-[72px] items-center justify-between gap-4">
                    <Link href={route('home')} className="flex min-w-0 items-center gap-3">
                        <img
                            src={logoSrc}
                            alt=""
                            className="h-10 w-10 shrink-0 object-contain"
                        />
                        <span className="hidden text-sm font-semibold leading-snug text-brand-purple sm:block sm:max-w-[14rem] md:max-w-none lg:text-base">
                            Canadian Deposit Insurance Corporation
                        </span>
                        <span className="text-sm font-semibold text-brand-purple sm:hidden">
                            {site.name}
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={linkHref(link)}
                                className="text-sm font-medium text-neutral-700 transition hover:text-brand-purple"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <button
                            type="button"
                            className="text-sm font-medium text-neutral-700 transition hover:text-brand-purple"
                            aria-label="Switch to French"
                        >
                            FR
                        </button>
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
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
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
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={linkHref(link)}
                                    className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <span className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700">
                                FR
                            </span>
                        </div>
                    </nav>
                )}
            </Container>
        </header>
    );
}
