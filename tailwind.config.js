/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        cream: "#f7f1e5",
        ivory: "#fbf7ef",
        saffron: "#b86628",
        maroon: "#7a2e23",
        gold: "#b9985b",
        ink: "#2c231f",
        muted: "#6b5a50",
        card: "#fffdf8"
      }
    }
  },
  plugins: []
};
