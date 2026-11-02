import BankCard from '@/Components/Frontend/BankCard';
import CanadaMark from '@/Components/Frontend/CanadaMark';
import Container from '@/Components/Frontend/Container';
import FrontendLayout from '@/Layouts/Frontend/FrontendLayout';
import { Head } from '@inertiajs/react';

export default function Index({ banks }) {
    const scrollToBanks = (event) => {
        event.preventDefault();
        document.getElementById('member-banks')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <FrontendLayout>
            <Head title="Simple and secure online banking" />

            <section className="bg-brand-purple text-white">
                <Container className="py-14 sm:py-20">
                    <CanadaMark light className="mb-6" />

                    <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
                        Simple and secure online banking
                    </h1>

                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
                        Choose your financial institution below and sign in to view your accounts,
                        balances and cards — protected with the same security you trust.
                    </p>

                    <a
                        href="#member-banks"
                        onClick={scrollToBanks}
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-purple shadow-sm transition hover:bg-neutral-100"
                    >
                        <svg
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden
                        >
                            <path d="M6.5 3A1.5 1.5 0 005 4.5V17h10V4.5A1.5 1.5 0 0013.5 3h-7ZM7 7h1.5v1.5H7V7Zm3 0h1.5v1.5H10V7ZM7 10h1.5v1.5H7V10Zm3 0h1.5v1.5H10V10Z" />
                        </svg>
                        Select your bank
                    </a>
                </Container>
            </section>

            <section id="member-banks" className="scroll-mt-20 bg-neutral-100/80 py-14 sm:py-16">
                <Container>
                    <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
                                Select your bank to sign in
                            </h2>
                            <p className="mt-1 text-sm text-neutral-500">All member institutions</p>
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {banks.map((bank) => (
                            <BankCard key={bank.name} bank={bank} />
                        ))}
                    </div>
                </Container>
            </section>

            <section id="calculator" className="scroll-mt-20 border-t border-neutral-200 bg-white py-12">
                <Container>
                    <h2 className="text-xl font-semibold text-neutral-900">
                        Deposit coverage calculator
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
                        Estimate how your deposits are protected across member institutions. This
                        tool will be available here soon.
                    </p>
                </Container>
            </section>
        </FrontendLayout>
    );
}
