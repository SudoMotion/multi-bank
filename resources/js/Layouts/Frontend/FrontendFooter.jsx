import CanadaMark from '@/Components/Frontend/CanadaMark';
import Container from '@/Components/Frontend/Container';
import { themeable } from '@/tenancy/theme';
import { useTenant } from '@/tenancy/useTenant';
import { Link, usePage } from '@inertiajs/react';

const footerLinks = [
    { label: 'Privacy', href: '#' },
    { label: 'Terms of use', href: '#' },
    { label: 'Accessibility', href: '#' },
    { label: 'Contact us', href: 'contact', route: true },
    { label: 'Admin', href: 'admin.login', route: true },
];

const socialLabels = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    x: 'X',
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
};

const linkClassName = 'text-sm opacity-80 transition hover:opacity-100';

function FooterLinks() {
    return (
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) =>
                link.route ? (
                    <Link key={link.label} href={route(link.href)} className={linkClassName}>
                        {link.label}
                    </Link>
                ) : (
                    <a key={link.label} href={link.href} className={linkClassName}>
                        {link.label}
                    </a>
                ),
            )}
        </nav>
    );
}

function TenantFooter({ year }) {
    const { site } = usePage().props;

    return (
        <footer className="bg-tenant-secondary text-tenant-on-secondary">
            <Container className="py-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="text-lg font-semibold">{site.name}</p>
                        <div className="mt-3 space-y-1 text-sm opacity-75">
                            {site.email && <p>{site.email}</p>}
                            {site.phone && <p>{site.phone}</p>}
                            {site.address && <p className="whitespace-pre-line">{site.address}</p>}
                        </div>
                    </div>

                    {site.social_media?.length > 0 && (
                        <div className="flex flex-wrap gap-4">
                            {site.social_media.map((item) => (
                                <a
                                    key={`${item.platform}-${item.url}`}
                                    href={item.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={linkClassName}
                                >
                                    {socialLabels[item.platform] ?? item.platform}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-8 border-t border-tenant-on-secondary/15 pt-6">
                    <FooterLinks />
                    <p className="mt-6 text-sm opacity-70">
                        &copy; {year} {site.name}. Deposits are protected by the Canadian Deposit
                        Insurance Corporation.
                    </p>
                </div>
            </Container>
        </footer>
    );
}

function FrontendFooter() {
    const tenant = useTenant();
    const { landing } = usePage().props;
    const year = new Date().getFullYear();

    if (tenant) {
        return <TenantFooter year={year} />;
    }

    return (
        <footer className="bg-neutral-900 text-white">
            <Container className="py-10">
                <CanadaMark light className="mb-6" />
                <FooterLinks />
                <p className="mt-8 text-sm text-white/70">
                    &copy; {year}
                    {landing?.footer_text ? ` — ${landing.footer_text}` : ''}
                </p>
            </Container>
        </footer>
    );
}

export default themeable('Layouts/Frontend/FrontendFooter', FrontendFooter);
