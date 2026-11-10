import LoginCurves from '@/Components/Auth/LoginCurves';
import SiteFavicon from '@/Components/SiteFavicon';
import { cn } from '@/Components/UI';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const LOGO_FALLBACK = '/images/rbc-logo-shield.svg';
const INTRO_MS = 1400;

export default function AuthAnimatedLayout({
    children,
    title,
    subtitle = 'Sign in to manage your banking online securely.',
    contentClassName = 'max-w-md',
    alignTop = false,
    footer = null,
}) {
    const { site } = usePage().props;
    const [phase, setPhase] = useState('intro');

    useEffect(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) {
            setPhase('split');
            return undefined;
        }

        const id = window.setTimeout(() => setPhase('split'), INTRO_MS);
        return () => window.clearTimeout(id);
    }, []);

    const displayName = title ?? site.application_name ?? site.name;
    const logoSrc = site.logo_url || LOGO_FALLBACK;
    const isSplit = phase === 'split';

    return (
        <div className="flex min-h-screen flex-col overflow-hidden bg-[#002d72] md:flex-row">
            <SiteFavicon />

            <div
                className={cn(
                    'relative flex shrink-0 overflow-hidden transition-[width,height] duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
                    isSplit ? 'h-[38vh] w-full md:h-screen md:w-1/2 lg:h-screen' : 'h-screen w-full',
                )}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="/images/login-bg.jpg"
                        alt=""
                        className={cn(
                            'h-full w-full object-cover transition-transform duration-[1200ms]',
                            isSplit ? 'animate-login-bg-zoom' : 'scale-100',
                        )}
                    />
                </div>

                <div
                    className={cn(
                        'absolute inset-0 bg-[#002d72] transition-opacity duration-[1200ms]',
                        isSplit ? 'opacity-70' : 'opacity-80',
                    )}
                />

                <LoginCurves
                    className={cn(
                        'transition-opacity duration-700 delay-300',
                        isSplit ? 'opacity-100' : 'opacity-0',
                    )}
                />

                <div
                    className={cn(
                        'relative z-10 flex w-full flex-col text-white transition-all duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
                        isSplit
                            ? 'h-full justify-center px-8 py-8 text-left md:px-12 lg:px-16'
                            : 'absolute inset-0 items-center justify-center px-6 text-center',
                    )}
                >
                    <img
                        src={logoSrc}
                        alt=""
                        className={cn(
                            'w-auto drop-shadow-md transition-all duration-[1200ms]',
                            isSplit ? 'mb-5 h-14 md:h-[72px]' : 'h-20 md:h-28',
                        )}
                    />
                    <h1
                        className={cn(
                            'font-medium tracking-tight transition-all duration-[1200ms]',
                            isSplit ? 'text-2xl md:text-[2rem]' : 'mt-8 text-3xl md:text-[2.75rem]',
                        )}
                    >
                        {displayName}
                    </h1>
                    <p
                        className={cn(
                            'mt-3 max-w-md leading-relaxed text-white/90 transition-all duration-700',
                            isSplit ? 'text-sm md:text-base' : 'text-base md:text-lg',
                            !isSplit && 'animate-login-fade-up',
                        )}
                        style={!isSplit ? { animationDelay: '0.2s', opacity: 0 } : undefined}
                    >
                        {subtitle}
                    </p>
                </div>
            </div>

            <div
                className={cn(
                    'flex min-h-0 flex-col bg-white transition-all duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
                    isSplit
                        ? 'w-full flex-1 md:w-1/2 md:flex-none'
                        : 'pointer-events-none max-h-0 w-full overflow-hidden opacity-0 md:w-0',
                )}
            >
                <div
                    className={cn(
                        'flex min-h-0 flex-1 flex-col overflow-y-auto',
                        alignTop ? 'justify-start' : 'justify-center',
                    )}
                >
                    <div
                        className={cn(
                            'flex flex-1 px-6 py-8 sm:px-10 md:py-10 lg:px-14',
                            alignTop ? 'items-start' : 'items-center justify-center',
                        )}
                    >
                        {isSplit && (
                            <div
                                className={cn(
                                    'w-full animate-login-fade-up opacity-0',
                                    contentClassName,
                                )}
                                style={{ animationDelay: '0.15s' }}
                            >
                                {children}
                            </div>
                        )}
                    </div>
                </div>

                {isSplit && footer}
            </div>
        </div>
    );
}
