export default function SectionHeading({ eyebrow, title, description, align = 'left' }) {
    const alignment =
        align === 'center' ? 'text-center mx-auto max-w-2xl' : 'text-left max-w-2xl';

    return (
        <div className={alignment}>
            {eyebrow && (
                <p className="text-sm font-medium uppercase tracking-wider text-neutral-500">
                    {eyebrow}
                </p>
            )}
            <h2 className="mt-2 text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl">
                {title}
            </h2>
            {description && (
                <p className="mt-3 text-base leading-relaxed text-neutral-600">{description}</p>
            )}
        </div>
    );
}
