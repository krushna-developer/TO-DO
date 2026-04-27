/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xs: "var(--text-xs)",
        sm: "var(--text-sm)",
        md: "var(--text-md)",
        base: "var(--text-base)",
        lg: "var(--text-lg)",
        xl: "var(--text-xl)",
        "2xl": "var(--text-2xl)",
        "3xl": "var(--text-3xl)",
        "4xl": "var(--text-4xl)",
        "5xl": "var(--text-5xl)",
        "7xl": "var(--text-7xl)",
      },
      fontWeight: {
        regular: "var(--fw-regular)",
        medium: "var(--fw-medium)",
        semibold: "var(--fw-semibold)",
        bold: "var(--fw-bold)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
  
