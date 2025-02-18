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
      },
      animation: {
        marquee: "marquee 20s linear infinite",
        reverse: "marquee-reverse 20s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" }, // Exact de helft voor seamless loop
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
    },
  },
  plugins: [],
}

