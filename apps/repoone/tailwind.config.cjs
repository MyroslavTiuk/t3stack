/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        orange: "#ef754f",
        blue: "#2D78C8",
        dark: "#221d28",
      },
      dropShadow: {
        "3xl": "4px 4px 40px rgba(0,0,0,0.99)",
      },
      fontFamily: {
        sans: ["Raleway", "sans-serif"],
        mono: ["Space Mono", "monospace"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("flowbite/plugin")],
};

module.exports = config;
