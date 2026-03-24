import type { Config } from "tailwindcss"
import sharedConfig from "@repo/ui/tailwind.config"

const config = {
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
		'../../packages/ui/src/**/*.{ts,tsx}',
	],
	presets: [sharedConfig],
} satisfies Config

export default config
