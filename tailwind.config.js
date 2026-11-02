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
        },
    },

    plugins: [forms],
};
