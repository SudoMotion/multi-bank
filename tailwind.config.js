import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    purple: '#4B286D',
                    'purple-dark': '#3A1F54',
                    'purple-light': '#5C3384',
                },
                tenant: {
                    primary: 'rgb(var(--tenant-primary) / <alpha-value>)',
                    'on-primary': 'rgb(var(--tenant-on-primary) / <alpha-value>)',
                    secondary: 'rgb(var(--tenant-secondary) / <alpha-value>)',
                    'on-secondary': 'rgb(var(--tenant-on-secondary) / <alpha-value>)',
                },
            },
            keyframes: {
                'slider-progress': {
                    from: { width: '0%' },
                    to: { width: '100%' },
                },
                'login-bg-zoom': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.08)' },
                },
                'login-curve-1': {
                    '0%, 100%': { transform: 'translateX(8px)', opacity: '0.75' },
                    '50%': { transform: 'translateX(-4px)', opacity: '1' },
                },
                'login-curve-2': {
                    '0%, 100%': { transform: 'translateX(-6px)', opacity: '0.7' },
                    '50%': { transform: 'translateX(6px)', opacity: '0.95' },
                },
                'login-curve-3': {
                    '0%, 100%': { transform: 'translateX(4px)', opacity: '0.65' },
                    '50%': { transform: 'translateX(-8px)', opacity: '0.9' },
                },
                'login-fade-up': {
                    from: { opacity: '0', transform: 'translateY(16px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                'slider-progress': 'slider-progress 7s linear forwards',
                'login-bg-zoom': 'login-bg-zoom 24s ease-in-out infinite',
                'login-curve-1': 'login-curve-1 6s ease-in-out infinite',
                'login-curve-2': 'login-curve-2 7s ease-in-out infinite',
                'login-curve-3': 'login-curve-3 8s ease-in-out infinite',
                'login-fade-up': 'login-fade-up 0.6s ease-out forwards',
            },
        },
    },

    plugins: [forms],
};
