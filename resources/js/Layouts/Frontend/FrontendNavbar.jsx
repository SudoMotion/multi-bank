import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Container from '@/Components/Frontend/Container';

const navLinks = [
    { name: 'Home', href: 'home', active: 'home' },
    { name: 'About', href: 'about', active: 'about' },
    { name: 'Contact', href: 'contact', active: 'contact' },
];

export default function FrontendNavbar() {
    const { site } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
            <Container>
                <div className="flex h-16 items-center justify-between">
                    <Link href={route('home')} className="flex items-center gap-3">
                        {site.logo_url ? (
                            <img
                                src={site.logo_url}
                                alt={site.name}
                                className="h-8 w-auto object-contain"
                            />
                        ) : (
                            <span className="text-lg font-medium text-neutral-900">{site.name}</span>
                        )}
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={route(link.href)}
                                className={
                                    'text-sm font-medium transition-colors ' +
                                    (route().current(link.active)
                                        ? 'text-neutral-900'
                                        : 'text-neutral-600 hover:text-neutral-900')
                                }
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-100 md:hidden"
                        onClick={() => setMobileOpen((open) => !open)}
                        aria-label="Toggle menu"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
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
                                    href={route(link.href)}
                                    className={
                                        'rounded-md px-3 py-2 text-sm font-medium ' +
                                        (route().current(link.active)
                                            ? 'bg-neutral-100 text-neutral-900'
                                            : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900')
                                    }
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </nav>
                )}
            </Container>
        </header>
    );
}
