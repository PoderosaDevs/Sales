/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0a0a0c",
          card: "#0d0d10",
        },
        emerald: {
          950: "#022c22",
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      keyframes: {
        "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
        "zoom-in": { from: { opacity: 0, transform: "scale(0.95)" }, to: { opacity: 1, transform: "scale(1)" } },
        "slide-in-bottom": { from: { opacity: 0, transform: "translateY(16px)" }, to: { opacity: 1, transform: "translateY(0)" } },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "zoom-in": "zoom-in 0.3s ease-out",
        "slide-in-bottom": "slide-in-bottom 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
