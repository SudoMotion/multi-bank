export default function AdminFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="fixed inset-x-0 bottom-0 z-30 flex h-10 items-center border-t border-gray-200 bg-white px-4 text-xs text-gray-500 sm:px-6 lg:left-64">
            <div className="flex w-full items-center justify-between">
                <span>&copy; {year} Attik Design. All rights reserved.</span>
                <span className="hidden sm:inline">Admin Panel v1.0</span>
            </div>
        </footer>
    );
}
