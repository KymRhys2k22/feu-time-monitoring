/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#009900", // FEU Green
        secondary: "#ffc20e", // FEU Gold
        neutral: "#818181", // Grey
      },
    },
  },
  plugins: [],
};
