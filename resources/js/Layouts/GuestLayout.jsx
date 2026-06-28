import AppLogo from '@/Components/AppLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-neutral-100 pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <AppLogo className="h-16 w-auto max-w-[200px] fill-current text-neutral-700" />
                </Link>
            </div>

            <div className="mt-8 w-full overflow-hidden border border-neutral-200 bg-white px-6 py-6 sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
