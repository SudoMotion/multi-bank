import Container from '@/Components/Frontend/Container';
import { Link, usePage } from '@inertiajs/react';

const socialLabels = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    x: 'X',
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
};

export default function FrontendFooter() {
    const { site } = usePage().props;
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-neutral-200 bg-neutral-50">
            <Container className="py-12">
                <div className="grid gap-10 md:grid-cols-3">
                    <div>
                        <p className="text-lg font-medium text-neutral-900">{site.name}</p>
                        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                            Thoughtful interior design for modern living spaces.
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-medium uppercase tracking-wider text-neutral-500">
                            Quick Links
                        </p>
                        <div className="mt-4 flex flex-col gap-2">
                            <Link href={route('home')} className="text-sm text-neutral-600 hover:text-neutral-900">
                                Home
                            </Link>
                            <Link href={route('about')} className="text-sm text-neutral-600 hover:text-neutral-900">
                                About Us
                            </Link>
                            <Link href={route('contact')} className="text-sm text-neutral-600 hover:text-neutral-900">
                                Contact Us
                            </Link>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium uppercase tracking-wider text-neutral-500">
                            Contact
                        </p>
                        <div className="mt-4 space-y-2 text-sm text-neutral-600">
                            {site.email && <p>{site.email}</p>}
                            {site.phone && <p>{site.phone}</p>}
                            {site.address && <p className="whitespace-pre-line">{site.address}</p>}
                        </div>

                        {site.social_media?.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-3">
                                {site.social_media.map((item) => (
                                    <a
                                        key={`${item.platform}-${item.url}`}
                                        href={item.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm text-neutral-600 hover:text-neutral-900"
                                    >
                                        {socialLabels[item.platform] ?? item.platform}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-10 border-t border-neutral-200 pt-6 text-center text-sm text-neutral-500">
                    &copy; {year} {site.name}. All rights reserved.
                </div>
            </Container>
        </footer>
    );
}
