import type { Config } from "tailwindcss";

// Trimmed from the Tarsha landing page's config to the tokens the voice library
// actually uses, so the demo stays a faithful slice of the same design system.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-muted": "var(--surface-muted)",
        ink: "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        "ink-faint": "var(--ink-faint)",
        accent: "var(--accent)",
        "accent-ink": "var(--accent-ink)",
        border: "var(--border)",
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "ui-sans-serif", "system-ui"],
        brand: ["var(--font-merriweather)", "Georgia", "Times New Roman", "serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
      },
      letterSpacing: {
        tighter2: "-0.03em",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(24,19,10,0.04), 0 8px 24px rgba(24,19,10,0.06)",
        lift: "0 4px 12px rgba(24,19,10,0.06), 0 24px 48px rgba(24,19,10,0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
