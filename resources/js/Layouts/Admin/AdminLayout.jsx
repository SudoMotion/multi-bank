import { useState } from 'react';
import AdminFooter from './AdminFooter';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

export default function AdminLayout({ title, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen((open) => !open);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminTopbar title={title} onToggleSidebar={toggleSidebar} />

            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            <AdminSidebar open={sidebarOpen} onNavigate={closeSidebar} />
            <AdminFooter />

            <main className="fixed bottom-10 left-0 right-0 top-14 overflow-y-auto bg-gray-50 transition-[left] duration-300 lg:left-64">
                <div className="p-4 sm:p-6 lg:p-8">{children}</div>
            </main>
        </div>
    );
}
