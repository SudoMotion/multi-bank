import SiteFavicon from '@/Components/SiteFavicon';
import FrontendFooter from './FrontendFooter';
import FrontendNavbar from './FrontendNavbar';

export default function FrontendLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-white text-neutral-900">
            <SiteFavicon />
            <FrontendNavbar />
            <main className="flex-1">{children}</main>
            <FrontendFooter />
        </div>
    );
}
