import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0E14",
        surface: "#141922",
        primary: "#3B82F6",
        accent: "#22D3EE",
        muted: "#94A3B8",
        "condition-new": "#22C55E",
        "condition-good": "#3B82F6",
        "condition-fair": "#F59E0B",
      },
    },
  },
  plugins: [],
};

export default config;