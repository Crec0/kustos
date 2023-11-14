import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                background: '#141b1e',
                'light-background': '#232a2d',
                error: '#e57474',
                success: '#8ccf7e',
                warning: '#e5c76b',
                info: '#67b0e8',
                magenta: '#c47fd5',
                cyan: '#6cbfbf',
                'light-gray': '#b3b9b8',
                white: '#dadada',
            },
        },
    },
    plugins: [
        plugin(function ({ matchUtilities }) {
            // Square utility
            matchUtilities({
                sq: (value) => ({
                    width: value,
                    height: value,
                }),
            });
        }),
    ],
} satisfies Config;
