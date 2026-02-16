import type { Config } from "tailwindcss"
import sharedConfig from "@repo/ui/tailwind.config"

const config = {
    content: [
        './app/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        '../../packages/ui/src/**/*.{ts,tsx}',
    ],
    presets: [sharedConfig],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-sans)", "sans-serif"],
            },
        },
    },
} satisfies Config

export default config
