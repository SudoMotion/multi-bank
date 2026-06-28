import { Link } from '@inertiajs/react';

export default function FrontendLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="text-lg font-semibold text-gray-900">
                        Attik Design
                    </Link>
                    <nav className="flex items-center gap-4 text-sm">
                        <Link href="/" className="text-gray-600 hover:text-gray-900">
                            Home
                        </Link>
                        <Link href={route('login')} className="text-gray-600 hover:text-gray-900">
                            Login
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-gray-200 bg-gray-50 py-6">
                <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
                    &copy; {new Date().getFullYear()} Attik Design
                </div>
            </footer>
        </div>
    );
}
