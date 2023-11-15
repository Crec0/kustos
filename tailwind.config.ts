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
                        '--color-error': 'rgb(229 116 116)',
                        '--color-error-60': 'rgb(229 116 116 / .6)',
                        '--color-success': 'rgb(140 207 126)',
                        '--color-success-60': 'rgb(140 207 126 / .6)',
                        '--color-warn': 'rgb(229 199 107)',
                        '--color-warn-60': 'rgb(229 199 107 / .6)',
                        '--color-info': 'rgb(103 176 232)',
                        '--color-info-60': 'rgb(103 176 232 / .6)',
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
