export default function AdminFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="fixed inset-x-0 bottom-0 z-30 flex h-10 items-center border-t border-neutral-200 bg-white px-2 text-xs text-neutral-500 md:px-4 lg:left-60">
            <div className="flex w-full items-center justify-center">
                <span>
                    &copy; {year}{' '}
                    <a
                        href="https://srsit.com.bd/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-neutral-700 hover:text-neutral-900 hover:underline"
                    >
                        SRS IT
                    </a>
                    . All rights reserved.
                </span>
            </div>
        </footer>
    );
}
