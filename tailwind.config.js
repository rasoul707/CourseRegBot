import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {},
    },
    darkMode: "class",
    plugins: [nextui({
        themes: {
            light: {
                colors: {
                    background: "rgb(239 239 239)",
                    primary: {
                        DEFAULT: "#FF921F",
                        50: "#FF921F",
                        100: "#FF921F",
                        200: "#ffc287",
                        300: "#ffb365",
                        400: "#ffa241",
                        500: "#FF921F",
                        600: "#FF921F",
                        700: "#FF921F",
                        800: "#FF921F",
                        900: "#FF921F",
                    },
                }
            }
        }
    })
    ],
}
