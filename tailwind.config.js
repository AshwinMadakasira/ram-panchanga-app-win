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
        cream: "#eef5fd",
        ivory: "#d8e8fb",
        saffron: "#b86628",
        maroon: "#7a2e23",
        gold: "#b9985b",
        ink: "#182533",
        muted: "#7a2e23",
        card: "#eef5fd",
        cardMuted: "#bfd8f2",
        border: "#99bce0",
        surfaceAccent: "#bfd8f2"
      }
    }
  },
  plugins: []
};
