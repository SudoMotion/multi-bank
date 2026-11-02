import '../css/app.css';
import './bootstrap';

import { ToastProvider } from '@/Components/UI/toast';
import {
    bootTheme,
    readInitialPage,
    readInitialTheme,
    resolveThemedPage,
} from '@/tenancy/theme';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

const initialPage = readInitialPage();
const appName =
    initialPage.props?.site?.name || import.meta.env.VITE_APP_NAME || 'Laravel';

bootTheme(readInitialTheme(initialPage)).then(() =>
    createInertiaApp({
        title: (title) => `${title} - ${appName}`,
        resolve: (name) => resolveThemedPage(name),
        setup({ el, App, props }) {
            const root = createRoot(el);

            root.render(
                <ToastProvider>
                    <App {...props} />
                </ToastProvider>,
            );
        },
        progress: {
            color: '#4B5563',
        },
    }),
);
