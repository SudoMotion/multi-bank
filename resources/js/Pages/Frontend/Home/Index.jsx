import Container from '@/Components/Frontend/Container';
import SectionHeading from '@/Components/Frontend/SectionHeading';
import { Button } from '@/Components/UI';
import FrontendLayout from '@/Layouts/Frontend/FrontendLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const services = [
    {
        title: 'Interior Design',
        description:
            'Tailored layouts, material palettes, and furniture plans that reflect your lifestyle.',
    },
    {
        title: 'Space Planning',
        description:
            'Functional room arrangements that maximize comfort, flow, and natural light.',
    },
    {
        title: 'Project Styling',
        description:
            'Finishing touches, decor selection, and cohesive styling for a polished result.',
    },
];

export default function Index({ aboutUs }) {
    const { site } = usePage().props;

    return (
        <FrontendLayout>
            <Head title="Home" />

            <section className="border-b border-neutral-200 bg-neutral-50">
                <Container className="py-16 sm:py-24">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-wider text-neutral-500">
                                Welcome to {site.name}
                            </p>
                            <h1 className="mt-4 text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl">
                                Design spaces that feel calm, refined, and uniquely yours.
                            </h1>
                            <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-600">
                                We create thoughtful interiors with a focus on balance, texture,
                                and timeless design for homes and commercial spaces.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link href={route('contact')}>
                                    <Button>Get in Touch</Button>
                                </Link>
                                <Link href={route('about')}>
                                    <Button variant="secondary">About Us</Button>
                                </Link>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
                            {aboutUs?.image_url ? (
                                <img
                                    src={aboutUs.image_url}
                                    alt={aboutUs.title || 'Interior design'}
                                    className="aspect-[4/3] w-full object-cover"
                                />
                            ) : (
                                <div className="flex aspect-[4/3] items-center justify-center bg-neutral-100">
                                    <p className="text-sm text-neutral-400">Featured image</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Container>
            </section>

            <section className="py-16 sm:py-20">
                <Container>
                    <SectionHeading
                        eyebrow="Services"
                        title="What we offer"
                        description="From concept to completion, we help you shape spaces with clarity and care."
                        align="center"
                    />

                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        {services.map((service) => (
                            <div
                                key={service.title}
                                className="rounded-lg border border-neutral-200 bg-white p-6"
                            >
                                <h3 className="text-lg font-medium text-neutral-900">
                                    {service.title}
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {aboutUs && (
                <section className="border-y border-neutral-200 bg-neutral-50 py-16 sm:py-20">
                    <Container>
                        <div className="grid items-center gap-10 lg:grid-cols-2">
                            {aboutUs.image_url && (
                                <img
                                    src={aboutUs.image_url}
                                    alt={aboutUs.title}
                                    className="aspect-[4/3] w-full rounded-lg border border-neutral-200 object-cover"
                                />
                            )}

                            <div>
                                <SectionHeading
                                    eyebrow="About Us"
                                    title={aboutUs.title || 'Our story'}
                                    description={
                                        aboutUs.description
                                            ? aboutUs.description.length > 220
                                                ? `${aboutUs.description.slice(0, 220)}...`
                                                : aboutUs.description
                                            : 'Learn more about our design philosophy and team.'
                                    }
                                />
                                <Link href={route('about')} className="mt-6 inline-block">
                                    <Button variant="outline">Read More</Button>
                                </Link>
                            </div>
                        </div>
                    </Container>
                </section>
            )}

            <section className="py-16 sm:py-20">
                <Container>
                    <div className="rounded-lg border border-neutral-200 bg-neutral-900 px-6 py-12 text-center sm:px-10">
                        <h2 className="text-3xl font-medium tracking-tight text-white">
                            Ready to start your project?
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-300">
                            Tell us about your space and we will help you bring your vision to life.
                        </p>
                        <Link href={route('contact')} className="mt-8 inline-block">
                            <Button variant="secondary">Contact Us</Button>
                        </Link>
                    </div>
                </Container>
            </section>
        </FrontendLayout>
    );
}
