/*
 * Design-token teaching note:
 * This file is the app's visual toolbox: colors, spacing, radii, and font names.
 *
 * Current design direction:
 * - cool Azure Paper palette for a calmer blue-toned light mode
 * - Neuton fonts for a more editorial feel
 * - page background slightly darker than cards so interactive surfaces stand out
 */
import type { AppLanguage } from "@/types/domain";

const headingFont = "Neuton-Bold";
const bodyFont = "Neuton-Regular";
const kannadaHeadingFont = "NotoSerifKannada-Bold";
const kannadaBodyFont = "NotoSerifKannada-Regular";

export const lightPalette = {
  ivory: "#d8e8fb",
  cream: "#eef5fd",
  card: "#eef5fd",
  cardMuted: "#bfd8f2",
  saffron: "#b86628",
  maroon: "#7a2e23",
  gold: "#b9985b",
  ink: "#182533",
  muted: "#7a2e23",
  border: "#99bce0",
  success: "#3f6b4f",
  warning: "#9b6b2d",
  danger: "#8f3b35",
  shadow: "rgba(43, 74, 112, 0.12)",
  surfaceAccent: "#bfd8f2"
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

export const createTypography = (language: AppLanguage) =>
  language === "kn"
    ? {
        headingFamily: kannadaHeadingFont,
        bodyFamily: kannadaBodyFont,
        bodyStrongFamily: kannadaHeadingFont,
        fontScale: 1.08,
        headingScale: 1.12,
        compactScale: 1.06
      }
    : {
        headingFamily: headingFont,
        bodyFamily: bodyFont,
        bodyStrongFamily: headingFont,
        fontScale: 1,
        headingScale: 1,
        compactScale: 1
      };
