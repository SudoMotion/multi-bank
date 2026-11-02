import Container from '@/Components/Frontend/Container';
import FrontendNavbar from '@/Layouts/Frontend/FrontendNavbar';
import { usePage } from '@inertiajs/react';

const DefaultNavbar = FrontendNavbar.Default;

export default function HeritageNavbar() {
    const { site } = usePage().props;

    return (
        <>
            <div className="bg-tenant-secondary text-tenant-on-secondary">
                <Container className="flex h-9 items-center justify-between text-xs">
                    <div className="flex gap-5 font-medium">
                        <span>Personal</span>
                        <span className="opacity-70">Business</span>
                        <span className="opacity-70">Wealth</span>
                    </div>
                    {site.phone && <span className="opacity-80">Call us: {site.phone}</span>}
                </Container>
            </div>
            <DefaultNavbar />
        </>
    );
}
