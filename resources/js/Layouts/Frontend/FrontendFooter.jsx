import CanadaMark from '@/Components/Frontend/CanadaMark';
import Container from '@/Components/Frontend/Container';
import { Link } from '@inertiajs/react';

const footerLinks = [
    { label: 'Privacy', href: '#' },
    { label: 'Terms of use', href: '#' },
    { label: 'Accessibility', href: '#' },
    { label: 'Contact us', href: 'contact', route: true },
    { label: 'Admin', href: 'admin.login', route: true },
];

export default function FrontendFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-neutral-900 text-white">
            <Container className="py-10">
                <CanadaMark light className="mb-6" />

                <nav className="flex flex-wrap gap-x-6 gap-y-2">
                    {footerLinks.map((link) =>
                        link.route ? (
                            <Link
                                key={link.label}
                                href={route(link.href)}
                                className="text-sm text-white/80 transition hover:text-white"
                            >
                                {link.label}
                            </Link>
                        ) : (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-sm text-white/80 transition hover:text-white"
                            >
                                {link.label}
                            </a>
                        ),
                    )}
                </nav>

                <p className="mt-8 text-sm text-white/70">
                    &copy; {year} — Deposits with member institutions are protected.
                </p>
            </Container>
        </footer>
    );
}
