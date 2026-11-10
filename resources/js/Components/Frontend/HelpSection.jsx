import Container from '@/Components/Frontend/Container';
import { cn } from '@/Components/UI';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

const quickLinks = [
    { name: "Today's Rates", icon: 'rates', href: '#' },
    { name: 'Foreign Exchange', icon: 'exchange', href: '#' },
    { name: 'Calculate My Mortgage Payments', icon: 'calculator', href: '#' },
    { name: 'Boost My RRSP Savings', icon: 'savings', href: '#' },
];

const topicColumns = [
    [
        {
            title: 'Buying a Home',
            description:
                'From saving for a down payment to choosing the right mortgage, we can help you every step of the way.',
            links: [
                { name: 'First-Time Home Buyers', href: '#' },
                { name: 'Mortgage Calculators', href: '#' },
            ],
        },
        {
            title: 'Going to School',
            description:
                'Banking solutions for students, including accounts, credit cards and ways to pay for your education.',
            links: [
                { name: 'Student Banking', href: '#' },
                { name: 'Student Lines of Credit', href: '#' },
            ],
        },
        {
            title: 'Resources for Seniors',
            description:
                'Tools and advice to help you manage your money, protect yourself from fraud and enjoy your retirement.',
            links: [
                { name: 'Banking for Seniors', href: '#' },
                { name: 'Fraud Prevention', href: '#' },
            ],
        },
    ],
    [
        {
            title: 'New to Canada',
            description:
                'Get started with a bank account, credit card and advice to help you settle into life in Canada.',
            links: [
                { name: 'Newcomer Banking', href: '#' },
                { name: 'Book an Appointment', route: 'contact' },
            ],
        },
        {
            title: 'Retirement Planning',
            description:
                'Plan for the retirement you want with RRSPs, RRIFs and guidance from our advisors.',
            links: [
                { name: 'RRSP Savings', href: '#' },
                { name: 'Talk to an Advisor', route: 'contact' },
            ],
        },
        {
            title: 'Online & Mobile Banking Tutorials',
            description:
                'Step-by-step tutorials to help you bank online and with the RBC Mobile App.',
            links: [
                { name: 'View Tutorials', href: '#' },
                { name: 'RBC Mobile App', href: '#' },
            ],
        },
    ],
];

function QuickLinkIcon({ name, className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
            {name === 'rates' && (
                <>
                    <path d="M19 5L5 19" />
                    <circle cx="7" cy="7" r="2.5" />
                    <circle cx="17" cy="17" r="2.5" />
                </>
            )}
            {name === 'exchange' && (
                <>
                    <path d="M20.5 12a8.5 8.5 0 01-14.9 5.6M3.5 12a8.5 8.5 0 0114.9-5.6" />
                    <path d="M18.6 3v3.6H15M5.4 21v-3.6H9" />
                    <path d="M14 9.5c-.4-.8-1.2-1.2-2-1.2-1.2 0-2 .7-2 1.6 0 2.2 4 1.1 4 3.3 0 .9-.9 1.6-2 1.6-.9 0-1.7-.4-2.1-1.2M12 7v1.3M12 14.8v1.2" />
                </>
            )}
            {name === 'calculator' && (
                <>
                    <rect x="3.5" y="3.5" width="17" height="17" rx="1" />
                    <path d="M12 3.5v17M3.5 12h17" />
                    <path d="M6 7.75h3.5M7.75 6v3.5M14.5 7.75H18M14.5 15.25H18M14.5 17H18M6.5 14.5l2.5 2.5M9 14.5L6.5 17" />
                </>
            )}
            {name === 'savings' && (
                <>
                    <path d="M18.5 10.5c-.6-3-3.3-5-6.8-5-1.1 0-2.1.2-3 .6L6.3 4.5v3.2A6 6 0 004.6 10H3v3.5h1.8c.5 1.2 1.3 2.2 2.4 3V19h2.7v-1.6c.6.1 1.2.2 1.8.2.7 0 1.3-.1 1.9-.2V19h2.7v-2.6c1.3-.9 2.2-2.2 2.5-3.6" />
                    <path d="M18.5 10.5c1 0 2 .6 2 1.6 0 .7-.5 1.2-1 1.2" />
                    <path d="M10 8.2c1-.3 2.2-.3 3.3 0" />
                    <circle cx="7.6" cy="10.4" r=".5" fill="currentColor" />
                </>
            )}
        </svg>
    );
}

function TopicLink({ item }) {
    const className = 'text-sm text-[#006ac3] hover:underline';

    if (item.route) {
        return (
            <Link href={route(item.route)} className={className}>
                {item.name}
            </Link>
        );
    }

    return (
        <a href={item.href} className={className}>
            {item.name}
        </a>
    );
}

function Topic({ topic, open, onToggle }) {
    return (
        <div className="border-b border-neutral-300">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-bold text-[#006ac3] hover:underline"
            >
                {topic.title}
                <svg
                    className={cn('h-4 w-4 shrink-0 transition-transform duration-200', open && 'rotate-180')}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.75}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>

            {open && (
                <div className="pb-5">
                    <p className="text-sm leading-relaxed text-neutral-700">{topic.description}</p>
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                        {topic.links.map((link) => (
                            <TopicLink key={link.name} item={link} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function HelpSection() {
    const [openTopics, setOpenTopics] = useState([]);

    const toggleTopic = (title) => {
        setOpenTopics((current) =>
            current.includes(title)
                ? current.filter((item) => item !== title)
                : [...current, title],
        );
    };

    return (
        <section className="bg-white py-16 sm:py-20">
            <Container>
                <div className="mx-auto max-w-[1170px]">
                    <h2 className="text-center text-3xl font-medium tracking-tight text-neutral-900 sm:text-[2.5rem] sm:leading-tight">
                        How can we help you today?
                    </h2>

                    <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-4">
                        {quickLinks.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="group flex items-center gap-4 text-[15px] leading-snug text-[#006ac3]"
                            >
                                <QuickLinkIcon
                                    name={item.icon}
                                    className="h-11 w-11 shrink-0 text-[#006ac3]"
                                />
                                <span className="max-w-[12rem] group-hover:underline">{item.name}</span>
                            </a>
                        ))}
                    </div>

                    <div className="mt-8 grid gap-x-8 md:grid-cols-2">
                        {topicColumns.map((topics, columnIndex) => (
                            <div
                                key={columnIndex}
                                className={cn(
                                    'border-neutral-300 md:mx-3 md:border-t',
                                    columnIndex === 0 && 'border-t',
                                )}
                            >
                                {topics.map((topic) => (
                                    <Topic
                                        key={topic.title}
                                        topic={topic}
                                        open={openTopics.includes(topic.title)}
                                        onToggle={() => toggleTopic(topic.title)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    <form
                        role="search"
                        onSubmit={(e) => e.preventDefault()}
                        className="mt-8 flex flex-col gap-4 border border-neutral-200 bg-white px-6 py-6 shadow-[0_2px_10px_rgba(0,0,0,0.08)] sm:flex-row sm:items-center sm:gap-8 sm:px-7"
                    >
                        <label htmlFor="help-search" className="shrink-0">
                            <span className="block font-serif text-base italic text-neutral-800">
                                Still need help?
                            </span>
                            <span className="mt-2 block h-1 w-12 bg-[#ffd200]" />
                        </label>

                        <div className="flex flex-1 gap-4">
                            <input
                                id="help-search"
                                type="search"
                                className="h-12 min-w-0 flex-1 border border-neutral-500 px-3 text-[15px] focus:border-[#006ac3] focus:ring-1 focus:ring-[#006ac3]"
                            />
                            <button
                                type="submit"
                                className="h-12 shrink-0 border border-neutral-300 bg-neutral-100 px-5 text-sm text-neutral-700 transition-colors hover:bg-neutral-200"
                            >
                                Find
                            </button>
                        </div>
                    </form>
                </div>
            </Container>
        </section>
    );
}
