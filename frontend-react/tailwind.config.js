/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Work Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        clay: "#1d70b8",
        moss: "#155488",
        ink: "#1f2d3d",
        paper: "#ffffff",
      },
      boxShadow: {
        card: "0 12px 30px rgba(17,38,62,0.12)",
      },
    },
  },
  plugins: [],
}
