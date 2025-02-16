/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FFF",
        text: "#333",
        primary: "#F2F2F2",
        primaryHelper: "#FAFAFA",
        secondary: "#004F73",
        accent: "#B8CAF6",
        accentLight: "#F1F5FD"
      }
    },
  },
  plugins: [],
}

