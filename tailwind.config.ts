import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "1.5rem",
			screens: { "2xl": "1400px" },
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				ember: {
					50: "#FFF4EA",
					100: "#FFE4CC",
					200: "#FFC799",
					300: "#FFA75C",
					400: "#FF8A2B",
					500: "#FF6A00",
					600: "#E05E00",
					700: "#B84E02",
					800: "#933E08",
					900: "#78350B",
				},
				"deep-orange": "#FF6A00",
				"bright-orange": "#FF8A2B",
				amber: "#FFC799",
				"burnt-red": "#B84E02",
				night: {
					blk: "#071018",
					base: "#0D1117",
					deep: "#08131E",
				},
				glass: {
					DEFAULT: "rgba(255,255,255,0.04)",
					border: "rgba(255,255,255,0.08)",
				},
			},
			fontFamily: {
				display: ['"Anton"', '"Oswald"', "sans-serif"],
				condensed: ['"Oswald"', "sans-serif"],
				inter: ["Inter", "system-ui", "sans-serif"],
			},
			fontSize: {
				giant: "clamp(5rem, 18vw, 18rem)",
				huge: "clamp(2.5rem, 6.5vw, 5.5rem)",
				h1: "clamp(2.8rem, 6.8vw, 5.2rem)",
			},
			letterSpacing: {
				giant: "-3px",
			},
			backgroundImage: {
				"gradient-primary": "var(--gradient-primary)",
				"gradient-ember": "var(--gradient-ember)",
			},
			boxShadow: {
				glass: "0 25px 80px rgba(0,0,0,0.45)",
				glow: "0 0 60px rgba(255,106,0,0.35)",
				"glow-sm": "0 0 24px rgba(255,106,0,0.4)",
				card: "0 25px 80px rgba(0,0,0,0.45)",
			},
			gridTemplateColumns: {
				"16": "repeat(16, minmax(0, 1fr))",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				flicker: {
					"0%,100%": { opacity: "0.55" },
					"50%": { opacity: "1" },
				},
				drift: {
					"0%": { transform: "translate3d(0,0,0)" },
					"100%": { transform: "translate3d(-40px,20px,0)" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				flicker: "flicker 4s ease-in-out infinite",
				drift: "drift 18s ease-in-out infinite alternate",
			},
		},
	},
	plugins: [animate],
} satisfies Config;