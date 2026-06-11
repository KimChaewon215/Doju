import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: "#FFD600",
        ink: "#0A0A0A",
        paper: "#F5F0E8",
        "paper-dark": "#EDE6D5",
        danger: "#E8162E",
      },
      fontFamily: {
        sans: ["var(--font-noto)", "sans-serif"],
        display: ["var(--font-black-han)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;