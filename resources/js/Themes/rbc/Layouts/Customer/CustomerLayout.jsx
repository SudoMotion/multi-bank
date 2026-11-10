import CustomerPanelHero from '@/Components/Customer/CustomerPanelHero';
import Container from '@/Components/Frontend/Container';
import FrontendLayout from '@/Layouts/Frontend/FrontendLayout';

export default function CustomerLayout({
    children,
    title,
    description,
    contentClassName = '',
    current,
}) {
    return (
        <FrontendLayout>
            <section className="relative overflow-hidden bg-[#006ac3] text-white">
                <div className="pointer-events-none absolute inset-0" aria-hidden>
                    <img
                        src="/images/header-bg.png"
                        alt=""
                        className="h-full w-full object-cover object-center"
                    />
                </div>
                <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#006ac3]/90 via-[#006ac3]/55 to-[#006ac3]/25"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#004a8f]/40 to-transparent"
                    aria-hidden
                />
                <Container className="relative py-8 sm:py-10 lg:py-12">
                    <CustomerPanelHero
                        current={current}
                        title={title}
                        description={description}
                    />
                </Container>
            </section>

            <section className="bg-[#eef2f6] py-8 sm:py-10">
                <Container>
                    <div className={contentClassName || 'mx-auto max-w-5xl'}>{children}</div>
                </Container>
            </section>
        </FrontendLayout>
    );
}
