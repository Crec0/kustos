import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                background: 'rgb(20 27 30)',
                'light-background': 'rgb(35 42 45)',
                magenta: 'rgb(196 127 213)',
                cyan: 'rgb(108 191 191)',
                'light-gray': 'rgb(179 185 184)',
                white: 'rgb(218 218 218)',
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
