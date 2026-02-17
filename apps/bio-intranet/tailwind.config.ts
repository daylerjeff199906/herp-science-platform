import type { Config } from "tailwindcss"
import sharedConfig from "@repo/ui/tailwind.config"

const config = {
    darkMode: ['class'],
    content: [
        './app/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        '../../packages/ui/src/**/*.{ts,tsx}',
    ],
    presets: [sharedConfig],
    theme: {
    	extend: {
    		fontFamily: {
    			sans: [
    				'var(--font-sans)',
    				'sans-serif'
    			]
    		},
    		colors: {
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		}
    	}
    },
} satisfies Config

export default config
