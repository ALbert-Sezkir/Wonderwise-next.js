import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        timberwolf: "var(--timberwolf)",
        brunswickgreen: "var(--brunswickgreen)",
        ferngreen: "var(--ferngreen)",
        grey: "var(--grey)",
      },
      fontFamily: {
        livvic: ['"Livvic"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;