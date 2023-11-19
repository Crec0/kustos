import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        fontFamily: {
            sans: ['"Quicksand Variable"'],
        },
        extend: {
            colors: {
                primary: '#3b3c3e',
                secondary: '#ffd775',
                'content-secondary': '#272829',
                accent: '#636e72',
                content: '#e0fbfc',
                background: '#272829',
                info: '#67B0E8',
                'info-content': '#eef7fc',
                success: '#8CCF7E',
                'success-content': '#eef7fc',
                warning: '#E5C76B',
                'warning-content': '#eef7fc',
                error: '#E57474',
                'error-content': '#eef7fc',
            },
        },
    },
    plugins: [
        plugin(
            function ({ addBase, matchUtilities }) {
                addBase({
                    [':root']: {
                        '--color-error': '#E57474',
                        '--color-error-60': '#ed9e9e',
                        '--color-success': '#8CCF7E',
                        '--color-success-60': '#afdda5',
                        '--color-warn': '#E5C76B',
                        '--color-warn-60': '#edd897',
                        '--color-info': '#67B0E8',
                        '--color-info-60': '#95c8ef',
                    },
                });
                matchUtilities({
                    sq: (value) => ({
                        width: value,
                        height: value,
                    }),
                });
            },
            {
                theme: {
                    extend: {
                        colors: {
                            error: 'var(--color-error)',
                            success: 'var(--color-error)',
                            warn: 'var(--color-error)',
                            info: 'var(--color-error)',
                        },
                    },
                },
            },
        ),
    ],
} satisfies Config;
