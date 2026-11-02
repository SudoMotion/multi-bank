import Container from '@/Components/Frontend/Container';
import SectionHeading from '@/Components/Frontend/SectionHeading';
import { Button } from '@/Components/UI';
import FrontendLayout from '@/Layouts/Frontend/FrontendLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ aboutUs }) {
    return (
        <FrontendLayout>
            <Head title="About Us" />

            <section className="border-b border-neutral-200 bg-neutral-50 py-14 sm:py-16">
                <Container>
                    <SectionHeading
                        eyebrow="About Us"
                        title={aboutUs?.title || 'Our Story'}
                        description="Discover who we are and what we stand for."
                    />
                </Container>
            </section>

            <section className="py-14 sm:py-16">
                <Container>
                    {aboutUs ? (
                        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
                            {aboutUs.image_url && (
                                <img
                                    src={aboutUs.image_url}
                                    alt={aboutUs.title}
                                    className="aspect-[4/3] w-full rounded-lg border border-neutral-200 object-cover"
                                />
                            )}

                            <div className={aboutUs.image_url ? '' : 'lg:col-span-2'}>
                                <div className="prose prose-neutral max-w-none">
                                    <p className="whitespace-pre-line text-base leading-relaxed text-neutral-600">
                                        {aboutUs.description ||
                                            'About us content will appear here once added from the admin panel.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-6 py-12 text-center">
                            <p className="text-sm text-neutral-600">
                                About us content is currently unavailable.
                            </p>
                            <Link href={route('contact')} className="mt-6 inline-block">
                                <Button variant="secondary">Contact Us</Button>
                            </Link>
                        </div>
                    )}
                </Container>
            </section>
        </FrontendLayout>
    );
}
