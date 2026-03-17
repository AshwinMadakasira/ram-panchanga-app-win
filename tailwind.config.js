/*
 * Styling-tool teaching note:
 * NativeWind/Tailwind is configured here even though many components use `StyleSheet`.
 * That keeps the styling pipeline valid and leaves room for utility classes where useful.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        cream: "#fffdf8",
        ivory: "#f2e8d8",
        saffron: "#b86628",
        maroon: "#7a2e23",
        gold: "#b9985b",
        ink: "#2c231f",
        muted: "#6b5a50",
        card: "#eadcc7",
        cardMuted: "#f0e6d7",
        border: "#e5d8c3",
        surfaceAccent: "#eadcc7"
      }
    }
  },
  plugins: []
};
