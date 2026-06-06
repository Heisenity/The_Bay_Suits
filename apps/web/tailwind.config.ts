import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f1f35",
        navy: "#16263d",
        champagne: "#cbb994",
        linen: "#f5f2ec",
        mist: "#e9edf0"
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        display: ["var(--font-cormorant)", "serif"]
      },
      boxShadow: {
        soft: "0 24px 70px rgba(15,31,53,.12)"
      }
    }
  },
  plugins: []
};

export default config;
