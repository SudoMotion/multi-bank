import { usePage } from '@inertiajs/react';

const legalLinks = ['Legal', 'Accessibility', 'Privacy & Security', 'Advertising & Cookies'];

function ExternalLinkIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
        </svg>
    );
}

export default function CustomerAuthFooter() {
    const { site } = usePage().props;
    const year = new Date().getFullYear();
    const bankName = site.application_name || site.name;

    return (
        <footer className="shrink-0 border-t border-neutral-200 px-4 py-6">
            <div className="mx-auto max-w-lg text-center text-xs leading-relaxed text-neutral-600">
                <p>
                    {bankName} Online Banking is provided by {bankName}. {bankName} Website, &copy; 1995-{year}
                </p>
                <p className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
                    {legalLinks.map((label) => (
                        <a
                            key={label}
                            href="#"
                            className="inline-flex items-center gap-1 text-[#006ac3] hover:underline"
                        >
                            {label}
                            <ExternalLinkIcon className="h-3 w-3 shrink-0" />
                        </a>
                    ))}
                </p>
            </div>
        </footer>
    );
}
