import CustomerAccountMenu from '@/Components/Customer/CustomerAccountMenu';
import Container from '@/Components/Frontend/Container';
import { MegaMenuPanel, MenuSections, MoreMenuPanel, NewBadge } from '@/Components/Frontend/MegaMenu';
import { cn } from '@/Components/UI';
import { MORE_MENU_TABS, PRIMARY_MENUS } from '@/constants/megaMenu';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const LOGO_SRC = '/images/rbc-logo-shield.svg';
const APP_BANNER_STORAGE_KEY = 'app-banner-dismissed';

const utilityLinks = [
    { name: 'Personal', route: 'home', active: true },
    { name: 'Business', href: '#' },
    { name: 'Commercial', href: '#' },
    { name: 'Wealth', href: '#' },
    {
        name: 'Institutional',
        children: ['Global Asset Management', 'Capital Markets', 'Investor Services'],
    },
    { name: 'About RBC', route: 'about' },
];

const MORE_MENU = 'more';

const siteLinks = [
    { name: 'About Us', route: 'about' },
    { name: 'Contact Us', route: 'contact' },
];

function NavItem({ item, className, children, ...props }) {
    if (item.route) {
        return (
            <Link href={route(item.route)} className={className} {...props}>
                {children ?? item.name}
            </Link>
        );
    }

    return (
        <a href={item.href} className={className} {...props}>
            {children ?? item.name}
        </a>
    );
}

function CaretIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 20 20" fill="currentColor">
            <path d="M5.5 7.5L10 12l4.5-4.5z" />
        </svg>
    );
}

function ChevronRightIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    );
}

function SearchIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
    );
}

function MobileAccordion({ title, open, onToggle, children }) {
    return (
        <div className="border-b border-neutral-100">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="flex w-full items-center justify-between px-3 py-3 text-left text-sm font-medium text-[#006ac3]"
            >
                {title}
                <CaretIcon className={cn('h-5 w-5 transition-transform', open && 'rotate-180')} />
            </button>
            {open && <div className="space-y-6 px-3 pb-5">{children}</div>}
        </div>
    );
}

function AppBanner({ siteName, onClose }) {
    return (
        <div className="border-b border-neutral-200 bg-[#f7f7f7]">
            <div className="flex h-12 items-center gap-3 px-2 sm:px-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#006ac3]">
                    <img src={LOGO_SRC} alt="" className="h-6 w-auto" />
                </div>

                <div className="min-w-0 flex-1 leading-tight">
                    <p className="truncate text-xs font-bold text-neutral-900">RBC Mobile</p>
                    <p className="truncate text-[11px] text-neutral-600">{siteName}</p>
                    <p className="truncate text-[11px] text-neutral-600">FREE - On Google Play</p>
                </div>

                <a
                    href="#"
                    className="shrink-0 rounded-sm bg-[#006ac3] px-3 py-1 text-[11px] font-bold uppercase text-white hover:bg-[#005daa]"
                >
                    Install
                </a>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close app banner"
                    className="shrink-0 p-1 text-[#006ac3] hover:text-[#005daa]"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default function FrontendNavbar() {
    const { site, customerSummary } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);
    const [utilityMenu, setUtilityMenu] = useState(null);
    const [mobileSection, setMobileSection] = useState(null);
    const [showAppBanner, setShowAppBanner] = useState(
        () => window.localStorage.getItem(APP_BANNER_STORAGE_KEY) !== '1',
    );

    const closeAppBanner = () => {
        window.localStorage.setItem(APP_BANNER_STORAGE_KEY, '1');
        setShowAppBanner(false);
    };

    const toggleMenu = (name) => setOpenMenu((current) => (current === name ? null : name));
    const toggleMobileSection = (name) => setMobileSection((current) => (current === name ? null : name));
    const activeMenu = PRIMARY_MENUS.find((menu) => menu.name === openMenu);

    useEffect(() => {
        if (!openMenu && !utilityMenu) {
            return undefined;
        }

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') {
                setOpenMenu(null);
                setUtilityMenu(null);
            }
        };
        window.addEventListener('keydown', closeOnEscape);

        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [openMenu, utilityMenu]);

    return (
        <header className="relative z-50 bg-white">
            {showAppBanner && <AppBanner siteName={site.name} onClose={closeAppBanner} />}

            <div className="hidden bg-[#005daa] md:block">
                <Container>
                    <div className="flex h-8 items-center justify-between text-xs text-white">
                        <nav className="flex h-full items-center gap-6">
                            {utilityLinks.map((item) =>
                                item.children ? (
                                    <div
                                        key={item.name}
                                        className="relative h-full"
                                        onMouseEnter={() => setUtilityMenu(item.name)}
                                        onMouseLeave={() => setUtilityMenu(null)}
                                    >
                                        <button
                                            type="button"
                                            aria-expanded={utilityMenu === item.name}
                                            onClick={() =>
                                                setUtilityMenu((current) => (current === item.name ? null : item.name))
                                            }
                                            className="flex h-full items-center gap-0.5 hover:underline"
                                        >
                                            {item.name}
                                            <CaretIcon
                                                className={cn(
                                                    'h-3.5 w-3.5 transition-transform',
                                                    utilityMenu === item.name && 'rotate-180',
                                                )}
                                            />
                                        </button>

                                        {utilityMenu === item.name && (
                                            <ul className="absolute right-0 top-full z-20 w-64 space-y-3 border border-neutral-200 bg-white px-4 py-4 shadow-[0_6px_16px_rgba(0,0,0,0.15)]">
                                                {item.children.map((child) => (
                                                    <li key={child}>
                                                        <a
                                                            href="#"
                                                            className="group flex items-center gap-2 text-sm text-[#006ac3]"
                                                        >
                                                            <ChevronRightIcon className="h-3 w-3 shrink-0" />
                                                            <span className="group-hover:underline">{child}</span>
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <NavItem
                                        key={item.name}
                                        item={item}
                                        className="relative flex h-full items-center gap-0.5 hover:underline"
                                    >
                                        {item.name}
                                        {item.active && (
                                            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white" />
                                        )}
                                    </NavItem>
                                ),
                            )}
                        </nav>

                        <a href="#" className="flex items-center gap-1.5 hover:underline">
                            <span className="h-2 w-2 rounded-full bg-[#ffd200]" />
                            Promotions
                        </a>
                    </div>
                </Container>
            </div>

            <div className="bg-[#006ac3]">
                <Container>
                    <div className="relative flex h-14 items-center justify-between md:h-16">
                        <Link
                            href={route('home')}
                            className="flex h-full items-start gap-4 md:gap-6"
                        >
                            <img
                                src={LOGO_SRC}
                                alt={site.name}
                                className="relative z-10 mt-1 h-[62px] w-auto md:h-[88px]"
                            />
                            <span className="self-center text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl">
                                Private Wealth
                            </span>
                        </Link>

                        <div className="flex items-center gap-6 text-white">
                            <form
                                role="search"
                                className="hidden items-center gap-2 border-b border-white/80 pb-1 lg:flex"
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <SearchIcon className="h-6 w-6 shrink-0" />
                                <input
                                    type="search"
                                    placeholder="Search RBC..."
                                    aria-label="Search"
                                    className="w-36 border-0 bg-transparent p-0 text-lg font-light text-white placeholder:text-white focus:ring-0"
                                />
                            </form>

                            <Link
                                href={route('contact')}
                                className="hidden items-center gap-1 text-sm hover:underline md:flex"
                            >
                                Contact Us
                                <ChevronRightIcon className="h-3.5 w-3.5" />
                            </Link>

                            <button
                                type="button"
                                className="hidden items-center text-sm hover:underline md:flex"
                            >
                                (EN)
                                <CaretIcon className="h-4 w-4" />
                            </button>

                            {customerSummary ? (
                                <CustomerAccountMenu />
                            ) : (
                                <Link
                                    href={route('customer.login')}
                                    className="inline-flex h-10 items-center bg-[#ffd200] px-4 text-sm font-medium text-[#002d72] transition-colors hover:bg-[#f5c800] md:h-11 md:px-5"
                                >
                                    Sign In
                                </Link>
                            )}

                            <button
                                type="button"
                                className="-mr-2 inline-flex items-center justify-center p-2 text-white md:hidden"
                                onClick={() => setMobileOpen((open) => !open)}
                                aria-label="Toggle menu"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    {mobileOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </Container>
            </div>

            <div className="border-b border-neutral-200 bg-white">
                <Container>
                    <div
                        className="relative hidden h-14 items-stretch justify-end md:flex"
                        onMouseLeave={() => setOpenMenu(null)}
                    >
                        <nav className="flex items-stretch gap-7">
                            {PRIMARY_MENUS.map((menu) =>
                                menu.columns ? (
                                    <button
                                        key={menu.name}
                                        type="button"
                                        aria-expanded={openMenu === menu.name}
                                        onMouseEnter={() => setOpenMenu(menu.name)}
                                        onClick={() => toggleMenu(menu.name)}
                                        className={cn(
                                            'relative flex items-center text-[15px]',
                                            openMenu === menu.name
                                                ? 'text-neutral-900'
                                                : 'text-[#006ac3] hover:underline',
                                        )}
                                    >
                                        {menu.name}
                                        {openMenu === menu.name && (
                                            <span className="absolute inset-x-0 bottom-0 h-[3px] bg-[#006ac3]" />
                                        )}
                                    </button>
                                ) : (
                                    <a
                                        key={menu.name}
                                        href="#"
                                        onMouseEnter={() => setOpenMenu(null)}
                                        className="flex items-center text-[15px] text-[#006ac3] hover:underline"
                                    >
                                        {menu.name}
                                    </a>
                                ),
                            )}
                        </nav>

                        <span className="ml-5 h-6 w-px self-center bg-neutral-300" />

                        <button
                            type="button"
                            aria-label="More links"
                            aria-expanded={openMenu === MORE_MENU}
                            onMouseEnter={() => setOpenMenu(MORE_MENU)}
                            onClick={() => toggleMenu(MORE_MENU)}
                            className="relative ml-3 inline-flex w-8 items-center justify-center text-[#006ac3]"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="5" r="1.75" />
                                <circle cx="12" cy="12" r="1.75" />
                                <circle cx="12" cy="19" r="1.75" />
                            </svg>
                            {openMenu === MORE_MENU && (
                                <span className="absolute inset-x-0 bottom-0 h-[3px] bg-[#006ac3]" />
                            )}
                        </button>

                        {openMenu && (
                            <div className="absolute -inset-x-4 top-full mt-px bg-white shadow-[0_10px_20px_rgba(0,0,0,0.15)]">
                                {openMenu === MORE_MENU ? (
                                    <MoreMenuPanel tabs={MORE_MENU_TABS} />
                                ) : (
                                    activeMenu && <MegaMenuPanel menu={activeMenu} />
                                )}
                            </div>
                        )}
                    </div>

                    <div className="h-6 md:hidden" />
                </Container>

                {mobileOpen && (
                    <nav className="border-t border-neutral-100 py-3 md:hidden">
                        <Container>
                            {PRIMARY_MENUS.map((menu) =>
                                menu.columns ? (
                                    <MobileAccordion
                                        key={menu.name}
                                        title={menu.name}
                                        open={mobileSection === menu.name}
                                        onToggle={() => toggleMobileSection(menu.name)}
                                    >
                                        {menu.columns.map((sections, index) => (
                                            <MenuSections key={index} sections={sections} linkClassName="text-sm" />
                                        ))}
                                    </MobileAccordion>
                                ) : (
                                    <a
                                        key={menu.name}
                                        href="#"
                                        className="block border-b border-neutral-100 px-3 py-3 text-sm font-medium text-[#006ac3]"
                                    >
                                        {menu.name}
                                    </a>
                                ),
                            )}

                            {MORE_MENU_TABS.map((tab) =>
                                tab.columns ? (
                                    <MobileAccordion
                                        key={tab.name}
                                        title={tab.name}
                                        open={mobileSection === tab.name}
                                        onToggle={() => toggleMobileSection(tab.name)}
                                    >
                                        {tab.columns.map((sections, index) => (
                                            <MenuSections key={index} sections={sections} linkClassName="text-sm" />
                                        ))}
                                    </MobileAccordion>
                                ) : (
                                    <a
                                        key={tab.name}
                                        href="#"
                                        className="block border-b border-neutral-100 px-3 py-3 text-sm font-medium text-[#006ac3]"
                                    >
                                        {tab.name}
                                        {tab.isNew && <NewBadge />}
                                    </a>
                                ),
                            )}

                            {siteLinks.map((item) => (
                                <NavItem
                                    key={item.name}
                                    item={item}
                                    className="block border-b border-neutral-100 px-3 py-3 text-sm font-medium text-[#006ac3]"
                                    onClick={() => setMobileOpen(false)}
                                />
                            ))}
                        </Container>
                    </nav>
                )}
            </div>
        </header>
    );
}
