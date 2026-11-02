export default function CanadaMark({ className = '', light = false }) {
    return (
        <span className={`inline-flex items-center gap-2 ${className}`}>
            <svg
                className="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                aria-hidden
            >
                <rect width="24" height="24" fill={light ? '#fff' : '#fff'} rx="1" />
                <path
                    fill="#D80621"
                    d="M12 3 13.2 8.5 18 7l-2.5 4.5L18 16l-4.8-1.5L12 20l-1.2-5.5L6 16l2.5-4.5L6 7l4.8 1.5L12 3Z"
                />
            </svg>
            <span
                className={
                    light
                        ? 'text-sm font-medium text-white/90'
                        : 'text-sm font-medium text-neutral-600'
                }
            >
                Canada
            </span>
        </span>
    );
}
