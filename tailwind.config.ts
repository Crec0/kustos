import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                black: {
                    DEFAULT: '#272829',
                    50: '#BFC1C3',
                    100: '#B5B7B9',
                    200: '#A0A2A5',
                    300: '#8B8E91',
                    400: '#777A7D',
                    500: '#636568',
                    600: '#4F5153',
                    700: '#3B3C3E',
                    800: '#272829',
                    900: '#0C0C0C',
                    950: '#000000',
                },
                gray: {
                    DEFAULT: '#61677A',
                    50: '#C3C6CF',
                    100: '#B8BBC6',
                    200: '#A1A6B4',
                    300: '#8A90A2',
                    400: '#747A90',
                    500: '#61677A',
                    600: '#535969',
                    700: '#464A58',
                    800: '#383C47',
                    900: '#2B2D36',
                    950: '#24262D',
                },
                iron: {
                    DEFAULT: '#D8D9DA',
                    50: '#E2E3E4',
                    100: '#D8D9DA',
                    200: '#C3C5C6',
                    300: '#AEB0B2',
                    400: '#999C9E',
                    500: '#84878B',
                    600: '#707376',
                    700: '#5C5F61',
                    800: '#484A4C',
                    900: '#343637',
                    950: '#2A2C2D',
                },
                varden: {
                    DEFAULT: '#FFF6E0',
                    50: '#FFFAEF',
                    100: '#FFF6E0',
                    200: '#FFECBC',
                    300: '#FFE199',
                    400: '#FFD775',
                    500: '#FFCD51',
                    600: '#FFC22E',
                    700: '#FFB80A',
                    800: '#E5A300',
                    900: '#C18900',
                    950: '#B07D00',
                },
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
