import Container from '@/Components/Frontend/Container';
import { SOCIAL_MEDIA_PLATFORMS } from '@/constants/socialMediaPlatforms';
import { usePage } from '@inertiajs/react';

const legalLinks = ['Legal', 'Accessibility', 'Privacy & Security', 'Advertising & Cookies'];

const socialIcons = {
    facebook: (
        <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z" />
    ),
    instagram: (
        <path d="M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm6.1-8.1a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21 8.1c-.1-1.5-.4-2.8-1.5-3.9S17.1 2.8 15.6 2.7c-1.5-.1-6-.1-7.5 0-1.5.1-2.8.4-3.9 1.5S2.8 6.6 2.7 8.1c-.1 1.5-.1 6 0 7.5.1 1.5.4 2.8 1.5 3.9s2.4 1.4 3.9 1.5c1.5.1 6 .1 7.5 0 1.5-.1 2.8-.4 3.9-1.5s1.4-2.4 1.5-3.9c.1-1.5.1-6 0-7.5Zm-2 9.1a3 3 0 0 1-1.7 1.7c-1.2.5-4 .4-5.3.4s-4.1.1-5.3-.4a3 3 0 0 1-1.7-1.7c-.5-1.2-.4-4-.4-5.3s-.1-4.1.4-5.3a3 3 0 0 1 1.7-1.7c1.2-.5 4-.4 5.3-.4s4.1-.1 5.3.4a3 3 0 0 1 1.7 1.7c.5 1.2.4 4 .4 5.3s.1 4.1-.4 5.3Z" />
    ),
    x: (
        <path d="M17.8 3h3l-6.6 7.6L22 21h-6.1l-4.8-6.3L5.6 21h-3l7.1-8.1L2.2 3h6.2l4.3 5.7L17.8 3Zm-1 16.2h1.7L7.3 4.7H5.5l11.3 14.5Z" />
    ),
    youtube: (
        <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
    ),
    linkedin: (
        <path d="M6.9 21H3.3V9.3h3.6V21ZM5.1 7.7a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM21 21h-3.6v-5.7c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V21H9.7V9.3h3.5v1.6c.5-.9 1.7-1.9 3.4-1.9 3.7 0 4.4 2.4 4.4 5.6V21Z" />
    ),
};

const linkIcon = (
    <path d="M10.6 13.4a1 1 0 0 1 0-1.4l3.5-3.5a1 1 0 1 1 1.4 1.4L12 13.4a1 1 0 0 1-1.4 0Zm-1.4 4.2-1 1a3 3 0 0 1-4.2-4.2l3-3a3 3 0 0 1 4.2 0 1 1 0 0 0 1.4-1.4 5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1a1 1 0 0 0-1.4-1.4Zm10.4-13.2a5 5 0 0 0-7 0l-1 1a1 1 0 1 0 1.4 1.4l1-1a3 3 0 0 1 4.2 4.2l-3 3a3 3 0 0 1-4.2 0 1 1 0 0 0-1.4 1.4 5 5 0 0 0 7 0l3-3a5 5 0 0 0 0-7Z" />
);

function ChevronIcon() {
    return (
        <svg className="mt-[5px] h-2.5 w-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
        </svg>
    );
}

function FooterLink({ href = '#', children }) {
    return (
        <li>
            <a href={href} className="group flex gap-2 text-sm leading-snug text-white">
                <ChevronIcon />
                <span className="group-hover:underline">{children}</span>
            </a>
        </li>
    );
}

function FooterColumn({ title, children }) {
    return (
        <div>
            <h2 className="text-base font-bold text-white">{title}</h2>
            <ul className="mt-3 space-y-2.5">{children}</ul>
        </div>
    );
}

function CdicBadge() {
    return (
        <a
            href="#"
            aria-label="Canada Deposit Insurance Corporation"
            className=""
        >
            <img src="/images/cdic-digital-symbol-en.svg" alt="Canada Deposit Insurance Corporation" className="h-16" />
        </a>
    );
}

export default function FrontendFooter() {
    const { site } = usePage().props;
    const year = new Date().getFullYear();
    const socialLabels = Object.fromEntries(SOCIAL_MEDIA_PLATFORMS.map((item) => [item.value, item.label]));

    return (
        <footer>
            <div className="bg-[#006ac3] py-10 sm:py-12">
                <Container>
                    <div className="mx-auto grid max-w-[1170px] gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                        <div className="space-y-10">
                            <FooterColumn title="About RBC">
                                <FooterLink>Investor Relations</FooterLink>
                                <FooterLink>Media Newsroom</FooterLink>
                                <FooterLink>Economics</FooterLink>
                            </FooterColumn>

                            <FooterColumn title="Work at RBC">
                                <FooterLink>Careers at RBC</FooterLink>
                            </FooterColumn>
                        </div>

                        <FooterColumn title="Customer Service">
                            <FooterLink>Apply Online</FooterLink>
                            <FooterLink href={`${route('home')}#branch-locator`}>Branch &amp; ATM Locator</FooterLink>
                            <FooterLink>Voluntary Codes &amp; Public Commitments</FooterLink>
                            {site.phone && (
                                <FooterLink href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}>{site.phone}</FooterLink>
                            )}
                        </FooterColumn>

                        <FooterColumn title="Daily Numbers">
                            <FooterLink>Foreign Exchange</FooterLink>
                            <FooterLink>Rates</FooterLink>
                            <FooterLink>Mortgage Rates</FooterLink>
                            <FooterLink>Mutual Funds</FooterLink>
                        </FooterColumn>

                        <div>
                            <FooterColumn title="Protecting Your Money">
                                <FooterLink>Canada Deposit Insurance Corporation Member Info</FooterLink>
                            </FooterColumn>
                            <div className="mt-5">
                                <CdicBadge />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            <div className="bg-[#5f5f5f] py-6">
                <Container>
                    <div className="mx-auto flex max-w-[1170px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="text-sm text-white">
                            <p>
                                {site.name} Website, &copy; 1995-{year}
                            </p>
                            <p className="mt-1">
                                {legalLinks.map((label, index) => (
                                    <span key={label}>
                                        {index > 0 && ' | '}
                                        <a href="#" className="underline hover:no-underline">
                                            {label}
                                        </a>
                                    </span>
                                ))}
                            </p>
                        </div>

                        <div className="flex items-center">
                            {site.social_media?.length > 0 && (
                                <div className="mr-6 flex items-center gap-5 border-r border-white/60 pr-6">
                                    {site.social_media.map((item) => (
                                        <a
                                            key={`${item.platform}-${item.url}`}
                                            href={item.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={socialLabels[item.platform] ?? item.platform}
                                            className="text-white transition-opacity hover:opacity-75"
                                        >
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                {socialIcons[item.platform] ?? linkIcon}
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="flex flex-col items-center gap-1 text-sm text-white hover:underline"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0-6 6m6-6 6 6" />
                                </svg>
                                Top
                            </button>
                        </div>
                    </div>
                </Container>
            </div>
        </footer>
    );
}
