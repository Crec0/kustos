import { skeleton } from '@skeletonlabs/tw-plugin';
import { join } from 'path';
import type { Config } from 'tailwindcss';

const config = {
    darkMode: 'class',
    content: [
        './src/**/*.{html,js,svelte,ts}',
        join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}'),
    ],

    plugins: [
        skeleton({
            themes: {
                custom: [
                    {
                        name: 'mah-theme',
                        properties: {
                            // =~= Theme Properties =~=
                            '--theme-font-family-base': `Quicksand Variable`,
                            '--theme-font-family-heading': `Quicksand Variable`,
                            '--theme-font-color-base': '0 0 0',
                            '--theme-font-color-dark': '255 255 255',
                            '--theme-rounded-base': '2px',
                            '--theme-rounded-container': '2px',
                            '--theme-border-base': '1px',
                            // =~= Theme On-X Colors =~=
                            '--on-primary': '0 0 0',
                            '--on-secondary': '0 0 0',
                            '--on-tertiary': '0 0 0',
                            '--on-success': '0 0 0',
                            '--on-warning': '0 0 0',
                            '--on-error': '0 0 0',
                            '--on-surface': '255 255 255',
                            // =~= Theme Colors  =~=
                            // primary | #FFCF81
                            '--color-primary-50': '255 248 236', // #fff8ec
                            '--color-primary-100': '255 245 230', // #fff5e6
                            '--color-primary-200': '255 243 224', // #fff3e0
                            '--color-primary-300': '255 236 205', // #ffeccd
                            '--color-primary-400': '255 221 167', // #ffdda7
                            '--color-primary-500': '255 207 129', // #FFCF81
                            '--color-primary-600': '230 186 116', // #e6ba74
                            '--color-primary-700': '191 155 97', // #bf9b61
                            '--color-primary-800': '153 124 77', // #997c4d
                            '--color-primary-900': '125 101 63', // #7d653f
                            // secondary | #ffe2b3
                            '--color-secondary-50': '255 251 244', // #fffbf4
                            '--color-secondary-100': '255 249 240', // #fff9f0
                            '--color-secondary-200': '255 248 236', // #fff8ec
                            '--color-secondary-300': '255 243 225', // #fff3e1
                            '--color-secondary-400': '255 235 202', // #ffebca
                            '--color-secondary-500': '255 226 179', // #ffe2b3
                            '--color-secondary-600': '230 203 161', // #e6cba1
                            '--color-secondary-700': '191 170 134', // #bfaa86
                            '--color-secondary-800': '153 136 107', // #99886b
                            '--color-secondary-900': '125 111 88', // #7d6f58
                            // tertiary | #fff1d9
                            '--color-tertiary-50': '255 253 249', // #fffdf9
                            '--color-tertiary-100': '255 252 247', // #fffcf7
                            '--color-tertiary-200': '255 252 246', // #fffcf6
                            '--color-tertiary-300': '255 249 240', // #fff9f0
                            '--color-tertiary-400': '255 245 228', // #fff5e4
                            '--color-tertiary-500': '255 241 217', // #fff1d9
                            '--color-tertiary-600': '230 217 195', // #e6d9c3
                            '--color-tertiary-700': '191 181 163', // #bfb5a3
                            '--color-tertiary-800': '153 145 130', // #999182
                            '--color-tertiary-900': '125 118 106', // #7d766a
                            // success | #BFD8AF
                            '--color-success-50': '245 249 243', // #f5f9f3
                            '--color-success-100': '242 247 239', // #f2f7ef
                            '--color-success-200': '239 245 235', // #eff5eb
                            '--color-success-300': '229 239 223', // #e5efdf
                            '--color-success-400': '210 228 199', // #d2e4c7
                            '--color-success-500': '191 216 175', // #BFD8AF
                            '--color-success-600': '172 194 158', // #acc29e
                            '--color-success-700': '143 162 131', // #8fa283
                            '--color-success-800': '115 130 105', // #738269
                            '--color-success-900': '94 106 86', // #5e6a56
                            // warning | #f6e58d
                            '--color-warning-50': '254 251 238', // #fefbee
                            '--color-warning-100': '253 250 232', // #fdfae8
                            '--color-warning-200': '253 249 227', // #fdf9e3
                            '--color-warning-300': '251 245 209', // #fbf5d1
                            '--color-warning-400': '249 237 175', // #f9edaf
                            '--color-warning-500': '246 229 141', // #f6e58d
                            '--color-warning-600': '221 206 127', // #ddce7f
                            '--color-warning-700': '185 172 106', // #b9ac6a
                            '--color-warning-800': '148 137 85', // #948955
                            '--color-warning-900': '121 112 69', // #797045
                            // error | #ff7675
                            '--color-error-50': '255 234 234', // #ffeaea
                            '--color-error-100': '255 228 227', // #ffe4e3
                            '--color-error-200': '255 221 221', // #ffdddd
                            '--color-error-300': '255 200 200', // #ffc8c8
                            '--color-error-400': '255 159 158', // #ff9f9e
                            '--color-error-500': '255 118 117', // #ff7675
                            '--color-error-600': '230 106 105', // #e66a69
                            '--color-error-700': '191 89 88', // #bf5958
                            '--color-error-800': '153 71 70', // #994746
                            '--color-error-900': '125 58 57', // #7d3a39
                            // surface | #2A2B2B
                            '--color-surface-50': '223 223 223', // #dfdfdf
                            '--color-surface-100': '212 213 213', // #d4d5d5
                            '--color-surface-200': '202 202 202', // #cacaca
                            '--color-surface-300': '170 170 170', // #aaaaaa
                            '--color-surface-400': '106 107 107', // #6a6b6b
                            '--color-surface-500': '42 43 43', // #2A2B2B
                            '--color-surface-600': '38 39 39', // #262727
                            '--color-surface-700': '32 32 32', // #202020
                            '--color-surface-800': '25 26 26', // #191a1a
                            '--color-surface-900': '21 21 21', // #151515
                        },
                    },
                ],
            },
        }),
    ],
} satisfies Config;

export default config;
