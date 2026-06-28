export default function AdminFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="fixed inset-x-0 bottom-0 z-30 flex h-10 items-center border-t border-gray-200 bg-white px-4 text-xs text-gray-500 sm:px-6 lg:left-64">
            <div className="flex w-full items-center justify-center">
                <span>&copy; {year} <a href="https://srsit.com.bd/" target="_blank" className="text-orange-500 font-bold hover:underline">SRS IT.</a> All rights reserved.</span>
            </div>
        </footer>
    );
}
