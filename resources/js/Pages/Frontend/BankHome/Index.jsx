import Container from '@/Components/Frontend/Container';
import SectionHeading from '@/Components/Frontend/SectionHeading';
import FrontendLayout from '@/Layouts/Frontend/FrontendLayout';
import { useTenant } from '@/tenancy/useTenant';
import { Head, Link, usePage } from '@inertiajs/react';

const services = [
    {
        title: 'Everyday Banking',
        description: 'Chequing and savings accounts with secure access to your balances anytime.',
    },
    {
        title: 'Cards',
        description: 'Credit and debit cards with real-time alerts and fraud protection.',
    },
    {
        title: 'Borrowing',
        description: 'Mortgages, lines of credit and loans tailored to your plans.',
    },
    {
        title: 'Investing',
        description: 'GICs, registered accounts and advice to help your savings grow.',
    },
];

export default function Index({ aboutUs }) {
    const tenant = useTenant();
    const { site } = usePage().props;
    const externalSignIn = tenant?.settings?.online_banking_url;

    return (
        <FrontendLayout>
            <Head title="Home" />

            <section className="bg-tenant-primary text-tenant-on-primary">
                <Container className="py-16 sm:py-24">
                    <p className="text-sm font-medium uppercase tracking-wider opacity-80">
                        Welcome to {site.name}
                    </p>
                    <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                        {tenant?.tagline || 'Banking that works around your life.'}
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed opacity-85 sm:text-lg">
                        Sign in to view your accounts, balances and cards — protected with the same
                        security you trust.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        {externalSignIn ? (
                            <a
                                href={externalSignIn}
                                className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-100"
                            >
                                Sign in to online banking
                            </a>
                        ) : (
                            <Link
                                href={route('customer.login')}
                                className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-100"
                            >
                                Sign in to online banking
                            </Link>
                        )}
                        <Link
                            href={route('customer.register')}
                            className="inline-flex items-center rounded-full border border-current px-6 py-3 text-sm font-semibold transition hover:opacity-80"
                        >
                            Register
                        </Link>
                        <Link
                            href={route('contact')}
                            className="inline-flex items-center rounded-full border border-current px-6 py-3 text-sm font-semibold transition hover:opacity-80"
                        >
                            Contact us
                        </Link>
                    </div>
                </Container>
            </section>

            <section className="bg-neutral-50 py-14 sm:py-16">
                <Container>
                    <SectionHeading
                        eyebrow="What we offer"
                        title="Products for every stage of life"
                    />

                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {services.map((service) => (
                            <div
                                key={service.title}
                                className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
                            >
                                <div className="mb-4 h-1 w-10 rounded-full bg-tenant-primary" />
                                <h3 className="text-lg font-semibold text-neutral-900">
                                    {service.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {aboutUs && (
                <section className="py-14 sm:py-16">
                    <Container>
                        <div className="grid items-center gap-10 lg:grid-cols-2">
                            {aboutUs.image_url && (
                                <img
                                    src={aboutUs.image_url}
                                    alt={aboutUs.title}
                                    className="aspect-[4/3] w-full rounded-xl border border-neutral-200 object-cover"
                                />
                            )}
                            <div className={aboutUs.image_url ? '' : 'lg:col-span-2'}>
                                <SectionHeading
                                    eyebrow="About us"
                                    title={aboutUs.title || `About ${site.name}`}
                                    description={
                                        aboutUs.description && aboutUs.description.length > 280
                                            ? `${aboutUs.description.slice(0, 280)}...`
                                            : aboutUs.description
                                    }
                                />
                                <Link
                                    href={route('about')}
                                    className="mt-6 inline-flex text-sm font-semibold text-tenant-primary hover:underline"
                                >
                                    Learn more &rarr;
                                </Link>
                            </div>
                        </div>
                    </Container>
                </section>
            )}
        </FrontendLayout>
    );
}
