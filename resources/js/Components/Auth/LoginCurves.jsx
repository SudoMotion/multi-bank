export default function LoginCurves({ className = '' }) {
    return (
        <svg
            className={`pointer-events-none absolute bottom-0 right-0 h-full w-24 sm:w-32 lg:w-40 ${className}`}
            viewBox="0 0 160 800"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
        >
            <path
                className="animate-login-curve-1 opacity-90"
                d="M160 0 C 80 120, 120 280, 40 400 S 100 620, 0 800 L 160 800 Z"
                fill="url(#curveCyan)"
            />
            <path
                className="animate-login-curve-2 opacity-85"
                d="M160 40 C 100 160, 140 320, 60 440 S 120 660, 20 800 L 160 800 Z"
                fill="url(#curveBlue)"
            />
            <path
                className="animate-login-curve-3 opacity-80"
                d="M160 80 C 120 200, 160 360, 80 480 S 140 700, 40 800 L 160 800 Z"
                fill="url(#curveYellow)"
            />
            <defs>
                <linearGradient id="curveCyan" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#00bcd4" />
                    <stop offset="100%" stopColor="#006ac3" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="curveBlue" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#006ac3" />
                    <stop offset="100%" stopColor="#003d73" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="curveYellow" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffd200" />
                    <stop offset="100%" stopColor="#ffc72c" stopOpacity="0.6" />
                </linearGradient>
            </defs>
        </svg>
    );
}
