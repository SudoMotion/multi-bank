import { cn } from '@/Components/UI';
import { useState } from 'react';

export function MenuSections({ sections, linkClassName }) {
    return (
        <div className="space-y-5">
            {sections.map((section) => (
                <div key={section.title}>
                    <p className="text-sm font-bold leading-5 text-neutral-900">{section.title}</p>
                    <ul className="mt-3 space-y-3">
                        {section.links.map((link) => (
                            <li key={link}>
                                <a
                                    href="#"
                                    className={cn(
                                        'block whitespace-pre-line text-[13px] leading-5 text-[#006ac3] hover:underline',
                                        linkClassName,
                                    )}
                                >
                                    {link}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

function PromoCard({ promo }) {
    return (
        <a href="#" className="group block self-start border border-neutral-300 bg-white">
            <img src={promo.image} alt="" className="aspect-[16/9] w-full object-cover" />
            <p className="px-3 pb-5 pt-4 text-[13px] leading-5 text-[#006ac3] group-hover:underline">
                {promo.text}
            </p>
        </a>
    );
}

export function MegaMenuPanel({ menu }) {
    return (
        <div className="px-4 pb-8 pt-5">
            <div className="grid grid-cols-4 gap-8">
                {menu.columns.map((sections, index) => (
                    <MenuSections key={index} sections={sections} />
                ))}
                {menu.promo && <PromoCard promo={menu.promo} />}
            </div>

            {menu.footnote && (
                <p className="mt-8 text-xs leading-relaxed text-neutral-600">{menu.footnote}</p>
            )}
        </div>
    );
}

export function NewBadge() {
    return (
        <span className="ml-1 inline-block bg-[#ffd200] px-1 text-[11px] font-bold leading-4 text-neutral-900">
            New
        </span>
    );
}

export function MoreMenuPanel({ tabs }) {
    const [activeTab, setActiveTab] = useState(() => tabs.find((tab) => tab.columns)?.name);
    const current = tabs.find((tab) => tab.name === activeTab);

    return (
        <div className="flex">
            <ul className="w-52 shrink-0 space-y-3 border-r border-neutral-200 py-5">
                {tabs.map((tab) => {
                    const active = tab.name === activeTab;

                    return (
                        <li key={tab.name}>
                            <a
                                href="#"
                                onMouseEnter={() => tab.columns && setActiveTab(tab.name)}
                                onFocus={() => tab.columns && setActiveTab(tab.name)}
                                className={cn(
                                    'relative block border-l-[3px] px-4 text-[13px] leading-5',
                                    active
                                        ? 'border-[#006ac3] font-bold text-neutral-900'
                                        : 'border-transparent text-[#006ac3] hover:underline',
                                )}
                            >
                                {tab.name}
                                {tab.isNew && <NewBadge />}
                            </a>
                        </li>
                    );
                })}
            </ul>

            {current?.columns && (
                <div className="grid flex-1 grid-cols-3 gap-8 px-8 pb-8 pt-5">
                    {current.columns.map((sections, index) => (
                        <MenuSections key={index} sections={sections} />
                    ))}
                </div>
            )}
        </div>
    );
}
