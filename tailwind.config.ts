import { join } from 'path';
import type { Config } from 'tailwindcss';

import { skeleton } from '@skeletonlabs/tw-plugin';


const config = {
    darkMode: 'class',
    content: [
        './src/**/*.{html,js,svelte,ts}',
        join(
            require.resolve('@skeletonlabs/skeleton'),
            '../**/*.{html,js,svelte,ts}',
        ),
    ],
    theme: {
        extend: {},
    },
    plugins: [
        skeleton({
            themes: {
                custom: [
                    {
                        name: 'da-theme',
                        properties: {
                            // =~= Theme Properties =~=
                            '--theme-font-family-base': `Quicksand Variable`,
                            '--theme-font-family-heading': `Quicksand Variable`,
                            '--theme-font-color-base': '0 0 0',
                            '--theme-font-color-dark': '255 255 255',
                            '--theme-rounded-base': '4px',
                            '--theme-rounded-container': '8px',
                            '--theme-border-base': '0px',
                            // =~= Theme On-X Colors =~=
                            '--on-primary': '255 255 255',
                            '--on-secondary': '0 0 0',
                            '--on-tertiary': '255 255 255',
                            '--on-success': '0 0 0',
                            '--on-warning': '0 0 0',
                            '--on-error': '0 0 0',
                            '--on-surface': '255 255 255',
                            // =~= Theme Colors  =~=
                            // primary | #3b3c3e
                            '--color-primary-50': '226 226 226', // #e2e2e2
                            '--color-primary-100': '216 216 216', // #d8d8d8
                            '--color-primary-200': '206 206 207', // #cececf
                            '--color-primary-300': '177 177 178', // #b1b1b2
                            '--color-primary-400': '118 119 120', // #767778
                            '--color-primary-500': '59 60 62', // #3b3c3e
                            '--color-primary-600': '53 54 56', // #353638
                            '--color-primary-700': '44 45 47', // #2c2d2f
                            '--color-primary-800': '35 36 37', // #232425
                            '--color-primary-900': '29 29 30', // #1d1d1e
                            // secondary | #67B0E8
                            '--color-secondary-50': '232 243 252', // #e8f3fc
                            '--color-secondary-100': '225 239 250', // #e1effa
                            '--color-secondary-200': '217 235 249', // #d9ebf9
                            '--color-secondary-300': '194 223 246', // #c2dff6
                            '--color-secondary-400': '149 200 239', // #95c8ef
                            '--color-secondary-500': '103 176 232', // #67B0E8
                            '--color-secondary-600': '93 158 209', // #5d9ed1
                            '--color-secondary-700': '77 132 174', // #4d84ae
                            '--color-secondary-800': '62 106 139', // #3e6a8b
                            '--color-secondary-900': '50 86 114', // #325672
                            // tertiary | #636e72
                            '--color-tertiary-50': '232 233 234', // #e8e9ea
                            '--color-tertiary-100': '224 226 227', // #e0e2e3
                            '--color-tertiary-200': '216 219 220', // #d8dbdc
                            '--color-tertiary-300': '193 197 199', // #c1c5c7
                            '--color-tertiary-400': '146 154 156', // #929a9c
                            '--color-tertiary-500': '99 110 114', // #636e72
                            '--color-tertiary-600': '89 99 103', // #596367
                            '--color-tertiary-700': '74 83 86', // #4a5356
                            '--color-tertiary-800': '59 66 68', // #3b4244
                            '--color-tertiary-900': '49 54 56', // #313638
                            // success | #8CCF7E
                            '--color-success-50': '238 248 236', // #eef8ec
                            '--color-success-100': '232 245 229', // #e8f5e5
                            '--color-success-200': '226 243 223', // #e2f3df
                            '--color-success-300': '209 236 203', // #d1eccb
                            '--color-success-400': '175 221 165', // #afdda5
                            '--color-success-500': '140 207 126', // #8CCF7E
                            '--color-success-600': '126 186 113', // #7eba71
                            '--color-success-700': '105 155 95', // #699b5f
                            '--color-success-800': '84 124 76', // #547c4c
                            '--color-success-900': '69 101 62', // #45653e
                            // warning | #E5C76B
                            '--color-warning-50': '251 247 233', // #fbf7e9
                            '--color-warning-100': '250 244 225', // #faf4e1
                            '--color-warning-200': '249 241 218', // #f9f1da
                            '--color-warning-300': '245 233 196', // #f5e9c4
                            '--color-warning-400': '237 216 151', // #edd897
                            '--color-warning-500': '229 199 107', // #E5C76B
                            '--color-warning-600': '206 179 96', // #ceb360
                            '--color-warning-700': '172 149 80', // #ac9550
                            '--color-warning-800': '137 119 64', // #897740
                            '--color-warning-900': '112 98 52', // #706234
                            // error | #E57474
                            '--color-error-50': '251 234 234', // #fbeaea
                            '--color-error-100': '250 227 227', // #fae3e3
                            '--color-error-200': '249 220 220', // #f9dcdc
                            '--color-error-300': '245 199 199', // #f5c7c7
                            '--color-error-400': '237 158 158', // #ed9e9e
                            '--color-error-500': '229 116 116', // #E57474
                            '--color-error-600': '206 104 104', // #ce6868
                            '--color-error-700': '172 87 87', // #ac5757
                            '--color-error-800': '137 70 70', // #894646
                            '--color-error-900': '112 57 57', // #703939
                            // surface | #272829
                            '--color-surface-50': '223 223 223', // #dfdfdf
                            '--color-surface-100': '212 212 212', // #d4d4d4
                            '--color-surface-200': '201 201 202', // #c9c9ca
                            '--color-surface-300': '169 169 169', // #a9a9a9
                            '--color-surface-400': '104 105 105', // #686969
                            '--color-surface-500': '39 40 41', // #272829
                            '--color-surface-600': '35 36 37', // #232425
                            '--color-surface-700': '29 30 31', // #1d1e1f
                            '--color-surface-800': '23 24 25', // #171819
                            '--color-surface-900': '19 20 20', // #131414
                        },
                    },
                ],
            },
        }),
    ],
} satisfies Config;

export default config;