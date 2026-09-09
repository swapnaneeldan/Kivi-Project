import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#0A0A0A",
        card: "#111112",
        "card-hover": "#16171A",
        "card-border": "#232326",
        accent: "#A8E063",
        "accent-dim": "#3A4A2A",
        ink: "#F2EFE6",
        muted: "#87888D",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: { card: "14px", pill: "999px" },
      boxShadow: {
        glow: "0 0 24px -4px rgba(168,224,99,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;