/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
  "hover:text-yellow-400",
  "hover:text-blue-600",
  "hover:text-emerald-400",
  "hover:text-purple-600",
  "hover:text-cyan-400",
  "hover:border-yellow-400",
  "hover:border-blue-600",
  "hover:border-emerald-400",
  "hover:border-purple-600",
  "hover:border-cyan-400",
  "hover:bg-yellow-500",
  "hover:bg-blue-600",
  "hover:bg-emerald-500",
  "hover:bg-purple-600",
  "hover:bg-cyan-500",
],
  theme: {
    extend: {},
  },
  plugins: [],
};

