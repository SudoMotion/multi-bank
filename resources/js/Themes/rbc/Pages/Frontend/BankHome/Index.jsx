import AwardsSection from '@/Components/Frontend/AwardsSection';
import BranchLocatorSection from '@/Components/Frontend/BranchLocatorSection';
import Container from '@/Components/Frontend/Container';
import HelpSection from '@/Components/Frontend/HelpSection';
import HeroSlider from '@/Components/Frontend/HeroSlider';
import MoneyMattersSection from '@/Components/Frontend/MoneyMattersSection';
import PersonalBankingSection from '@/Components/Frontend/PersonalBankingSection';
import { Button } from '@/Components/UI';
import FrontendLayout from '@/Layouts/Frontend/FrontendLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ sliders = [], blogs = [], awards = [], aboutUs }) {
    const { site } = usePage().props;

    return (
        <FrontendLayout>
            <Head title="Home" />

            {sliders.length > 0 ? (
                <HeroSlider sliders={sliders} />
            ) : (
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
            )}

            <PersonalBankingSection />

            <HelpSection />

            <MoneyMattersSection blogs={blogs} />

            <AwardsSection awards={awards} />

            <BranchLocatorSection />
        </FrontendLayout>
    );
}
