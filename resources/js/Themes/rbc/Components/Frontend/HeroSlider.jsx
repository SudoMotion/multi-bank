import { cn } from '@/Components/UI';
import { useEffect, useState } from 'react';

const AUTOPLAY_DELAY = 7000;

const buttonColorClassNames = {
    white: 'border-white bg-white text-[#002d72] hover:bg-[#e8eef7]',
    outline: 'border-white bg-transparent text-white hover:bg-white/10',
    yellow: 'border-[#ffc72c] bg-[#ffc72c] text-[#002d72] hover:bg-[#f5b800]',
    blue: 'border-[#005daa] bg-[#005daa] text-white hover:bg-[#004c8c]',
};

function ClockIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function PlayPauseIcon({ playing, className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            {playing ? (
                <path d="M8 6.5h2.75v11H8zM13.25 6.5H16v11h-2.75z" />
            ) : (
                <path d="M9.5 7v10l8-5z" />
            )}
        </svg>
    );
}

function Slide({ slider, active }) {
    return (
        <div
            className="relative flex w-full shrink-0 flex-col overflow-hidden bg-[#073975] xl:aspect-[1756/530] xl:overflow-visible"
            aria-hidden={!active}
        >
            {slider.image_url && (
                <img
                    src={slider.image_url}
                    alt={slider.title}
                    className="aspect-[16/9] w-full object-cover object-right sm:aspect-[21/9] xl:absolute xl:inset-0 xl:aspect-auto xl:h-full"
                />
            )}

            <div className="relative px-6 pb-10 pt-8 sm:px-10 xl:pb-[5cqw] xl:pl-[17cqw] xl:pr-0 xl:pt-[5cqw]">
                {slider.badge_text && (
                    <span className="inline-block rounded-sm bg-[#ffc72c] px-1.5 py-0.5 text-[10px] font-bold uppercase leading-tight tracking-wide text-[#002d72] xl:px-[0.55cqw] xl:py-[0.2cqw] xl:text-[max(10px,0.75cqw)]">
                        {slider.badge_text}
                    </span>
                )}

                <h2 className="mt-3 text-[1.625rem] font-medium leading-[1.2] text-white sm:text-[1.75rem] xl:mt-[1.1cqw] xl:max-w-[44cqw] xl:text-[2.5cqw]">
                    {slider.title}
                </h2>

                {slider.subtitle && (
                    <p className="mt-2 text-sm text-white sm:text-[15px] xl:mt-[0.7cqw] xl:text-[max(14px,1.1cqw)]">
                        {slider.subtitle}
                    </p>
                )}

                {slider.description && (
                    <p className="mt-8 flex items-center gap-1.5 text-xs text-white xl:mt-[3.4cqw] xl:gap-[0.5cqw] xl:text-[max(12px,0.85cqw)]">
                        <ClockIcon className="h-3.5 w-3.5 shrink-0 xl:h-[max(12px,1cqw)] xl:w-[max(12px,1cqw)]" />
                        <span>{slider.description}</span>
                    </p>
                )}

                {slider.buttons.length > 0 && (
                    <div
                        className={cn(
                            'flex flex-wrap gap-4 xl:gap-[1.4cqw]',
                            slider.description ? 'mt-4 xl:mt-[1.4cqw]' : 'mt-8 xl:mt-[3.4cqw]',
                        )}
                    >
                        {slider.buttons.map((button, index) => (
                            <a
                                key={index}
                                href={button.url}
                                tabIndex={active ? undefined : -1}
                                className={cn(
                                    'inline-flex h-11 min-w-[9rem] items-center justify-center border px-7 text-sm font-medium transition-colors xl:h-[max(40px,3.45cqw)] xl:min-w-[11cqw] xl:px-[1.8cqw] xl:text-[max(13px,1cqw)]',
                                    buttonColorClassNames[button.color] ?? buttonColorClassNames.white,
                                )}
                            >
                                {button.text}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function NavigationCard({ slider, active, playing, onSelect, onProgressEnd }) {
    return (
        <button
            type="button"
            onClick={onSelect}
            aria-label={slider.link_text}
            aria-current={active}
            className="group relative h-[5.5rem] w-32 shrink-0 overflow-hidden rounded-md bg-[#073975] text-left shadow-[0_2px_8px_rgba(0,0,0,0.25)] sm:h-24 sm:w-36 xl:h-[8.6cqw] xl:w-[11.5cqw]"
        >
            {slider.image_url && (
                <img
                    src={slider.image_url}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-[78%_center] transition-transform duration-300 group-hover:scale-105"
                />
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-[#06214f] from-30% via-[#06214f]/70 via-50% to-transparent" />

            {active && (
                <span
                    key={slider.id}
                    className="absolute left-0 top-0 h-1 animate-slider-progress bg-[#ffc72c]"
                    style={{
                        animationDuration: `${AUTOPLAY_DELAY}ms`,
                        animationPlayState: playing ? 'running' : 'paused',
                    }}
                    onAnimationEnd={onProgressEnd}
                />
            )}

            <span className="absolute inset-x-2.5 bottom-2.5 line-clamp-2 text-xs font-medium leading-snug text-white sm:text-[13px] xl:inset-x-[0.8cqw] xl:bottom-[0.8cqw] xl:text-[max(12px,0.95cqw)]">
                {slider.link_text}
            </span>
        </button>
    );
}

export default function HeroSlider({ sliders }) {
    const count = sliders.length;
    const hasMultiple = count > 1;
    const slides = hasMultiple ? [sliders[count - 1], ...sliders, sliders[0]] : sliders;

    const [position, setPosition] = useState(hasMultiple ? 1 : 0);
    const [animate, setAnimate] = useState(true);
    const [playing, setPlaying] = useState(true);

    const current = hasMultiple ? (position - 1 + count) % count : 0;

    useEffect(() => {
        if (animate) {
            return undefined;
        }

        const frame = requestAnimationFrame(() => {
            requestAnimationFrame(() => setAnimate(true));
        });

        return () => cancelAnimationFrame(frame);
    }, [animate]);

    if (count === 0) {
        return null;
    }

    const goTo = (index) => {
        setAnimate(true);
        setPosition(index + 1);
    };

    const next = () => {
        setAnimate(true);
        setPosition((value) => Math.min(value + 1, count + 1));
    };

    const handleTransitionEnd = (e) => {
        if (e.target !== e.currentTarget) {
            return;
        }

        if (position === count + 1) {
            setAnimate(false);
            setPosition(1);
        } else if (position === 0) {
            setAnimate(false);
            setPosition(count);
        }
    };

    return (
        <section className="overflow-hidden bg-white">
            <div className="px-4 [container-type:inline-size] sm:px-8 lg:px-[4.5%]">
                <div
                    className={cn(
                        'flex gap-[--slider-gap] [--slider-gap:0.75rem] lg:[--slider-gap:1rem]',
                        animate && 'transition-transform duration-700 ease-in-out',
                    )}
                    style={{
                        transform: `translateX(calc(${-position} * (100% + var(--slider-gap))))`,
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {slides.map((slider, index) => (
                        <Slide
                            key={`${slider.id}-${index}`}
                            slider={slider}
                            active={index === position}
                        />
                    ))}
                </div>

                {hasMultiple && (
                    <div className="relative mt-3 flex items-end gap-5 xl:-mt-[4.3cqw] xl:gap-[2.4cqw] xl:pl-[17cqw]">
                        <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-2 pt-1 xl:gap-[1cqw] xl:overflow-visible xl:pb-0">
                            {sliders.map((slider, index) => (
                                <NavigationCard
                                    key={slider.id}
                                    slider={slider}
                                    active={index === current}
                                    playing={playing}
                                    onSelect={() => goTo(index)}
                                    onProgressEnd={next}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => setPlaying((value) => !value)}
                            aria-label={playing ? 'Pause slider' : 'Play slider'}
                            className="mb-4 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#005daa] text-[#005daa] transition-colors hover:bg-[#005daa] hover:text-white xl:mb-[1.25cqw] xl:h-[max(24px,1.8cqw)] xl:w-[max(24px,1.8cqw)]"
                        >
                            <PlayPauseIcon playing={playing} className="h-3.5 w-3.5 xl:h-[60%] xl:w-[60%]" />
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-4 h-10 bg-[#f3f3f3] xl:mt-0" />
        </section>
    );
}
