import { Platform } from "react-native";

const serifFont = Platform.select({
  ios: "Palatino",
  android: "serif",
  default: "serif"
});

const sansFont = Platform.select({
  ios: "Avenir Next",
  android: "sans-serif",
  default: "sans-serif"
});

export const lightPalette = {
  ivory: "#fbf7ef",
  cream: "#f4ecde",
  card: "#fffdf8",
  cardMuted: "#f0e6d7",
  saffron: "#b86628",
  maroon: "#7a2e23",
  gold: "#b9985b",
  ink: "#2c231f",
  muted: "#6b5a50",
  border: "#e5d8c3",
  success: "#3f6b4f",
  warning: "#9b6b2d",
  danger: "#8f3b35",
  shadow: "rgba(76, 44, 27, 0.08)",
  surfaceAccent: "#fff7f0"
} as const;

export const darkPalette = {
  ivory: "#17120f",
  cream: "#211a16",
  card: "#231b17",
  cardMuted: "#2f241e",
  saffron: "#e0a55a",
  maroon: "#d47a5f",
  gold: "#d9bd7d",
  ink: "#f4eadc",
  muted: "#c7b3a1",
  border: "#43352c",
  success: "#84bf96",
  warning: "#d5aa5c",
  danger: "#e08a7d",
  shadow: "rgba(0, 0, 0, 0.32)",
  surfaceAccent: "#31251f"
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28
} as const;

export const radii = {
  sm: 12,
  md: 18,
  lg: 24,
  pill: 999
} as const;

export const typography = {
  headingFamily: serifFont,
  bodyFamily: sansFont,
  headingWeight: Platform.select({ ios: "700", android: "700", default: "700" }),
  bodyWeight: Platform.select({ ios: "400", android: "400", default: "400" })
} as const;
