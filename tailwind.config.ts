import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Space Grotesk — headlines, nav, badges, hero text
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        // DM Sans — body text, descriptions, labels
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        // Keep for backward compat
        inter: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        // JetBrains Mono — all data numbers, metrics, code
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        'data-xl': ['24px', { lineHeight: '1.2', fontWeight: '700' }],
        'data-lg': ['18px', { lineHeight: '1.3', fontWeight: '600' }],
        'data-sm': ['12px', { lineHeight: '1.4', fontWeight: '500' }],
        caption: ['10px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Ice Blue System
        sky: {
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
        },
        // Semantic Colors
        growth: "#22C55E",
        decline: "#EF4444",
        warning: "#F59E0B",
        shell: "#F97316",
        verified: "#0EA5E9",
        political: "#A855F7",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glass: "0 4px 30px rgba(0, 0, 0, 0.1)",
        ice: "0 0 15px rgba(14, 165, 233, 0.5)",
      },
      keyframes: {
        "glass-enter": {
          "0%": { opacity: "0", transform: "translateY(10px)", backdropFilter: "blur(0px)" },
          "100%": { opacity: "1", transform: "translateY(0)", backdropFilter: "blur(20px)" },
        },
      },
      animation: {
        "glass-enter": "glass-enter 0.4s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
