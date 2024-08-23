import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 0.5s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "custom-green": "#07C15B",
        "custom-green-pastel": "#86AB89",
        "custom-green-hover": "#0acb61",
        "custom-yellow": "#FF9F1C",
        "custom-yellow-2": "#FFBF69",
        "custom-red": "#CC2936",
        "custom-red-hover": "#f2303b",
        "custom-blue": "#576490",
      },
    },
  },
  plugins: [],
}
export default config
