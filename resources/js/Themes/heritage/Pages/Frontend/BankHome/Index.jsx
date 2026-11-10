import Container from '@/Components/Frontend/Container';
import FrontendLayout from '@/Layouts/Frontend/FrontendLayout';
import { useTenant } from '@/tenancy/useTenant';
import { Head, Link, usePage } from '@inertiajs/react';

const highlights = [
    { value: '150+', label: 'Years serving our communities' },
    { value: '24/7', label: 'Secure online and mobile banking' },
    { value: '$100k', label: 'Eligible deposits insured per category' },
];

export default function Index({ aboutUs }) {
    const tenant = useTenant();
    const { site } = usePage().props;
    const externalSignIn = tenant?.settings?.online_banking_url;

    return (
        <FrontendLayout>
            <Head title="Home" />

            <section className="border-b border-neutral-200 bg-[#FAF7F2]">
                <Container className="grid items-center gap-12 py-16 lg:grid-cols-5 lg:py-24">
                    <div className="lg:col-span-3">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-tenant-primary">
                            {site.name}
                        </p>
                        <h1 className="mt-5 font-serif text-4xl leading-tight text-neutral-900 sm:text-5xl">
                            {tenant?.tagline || 'A tradition of trust, built for tomorrow.'}
                        </h1>
                        <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-600">
                            {aboutUs?.description
                                ? aboutUs.description.slice(0, 220)
                                : 'Personal service, modern tools and the security you expect from a bank that has stood the test of time.'}
                        </p>
                        <Link
                            href={route('about')}
                            className="mt-8 inline-flex border-b-2 border-tenant-primary pb-1 text-sm font-semibold text-neutral-900"
                        >
                            Our story
                        </Link>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
                            <h2 className="font-serif text-2xl text-neutral-900">Online banking</h2>
                            <p className="mt-2 text-sm text-neutral-500">
                                View balances, pay bills and manage your cards securely.
                            </p>
                            {externalSignIn ? (
                                <a
                                    href={externalSignIn}
                                    className="mt-6 flex w-full items-center justify-center rounded-lg bg-tenant-primary px-4 py-3 text-sm font-semibold text-tenant-on-primary transition hover:opacity-90"
                                >
                                    Sign in
                                </a>
                            ) : (
                                <Link
                                    href={route('customer.login')}
                                    className="mt-6 flex w-full items-center justify-center rounded-lg bg-tenant-primary px-4 py-3 text-sm font-semibold text-tenant-on-primary transition hover:opacity-90"
                                >
                                    Sign in
                                </Link>
                            )}
                            {!externalSignIn && (
                                <Link
                                    href={route('customer.register')}
                                    className="mt-3 flex w-full items-center justify-center rounded-lg border border-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
                                >
                                    Register
                                </Link>
                            )}
                        </div>
                    </div>
                </Container>
            </section>

            <section className="py-14">
                <Container className="grid gap-8 sm:grid-cols-3">
                    {highlights.map((item) => (
                        <div key={item.label} className="border-l-2 border-tenant-primary pl-5">
                            <p className="font-serif text-3xl text-neutral-900">{item.value}</p>
                            <p className="mt-1 text-sm text-neutral-600">{item.label}</p>
                        </div>
                    ))}
                </Container>
            </section>
        </FrontendLayout>
    );
}
