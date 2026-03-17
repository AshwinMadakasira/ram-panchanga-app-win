/*
 * Theme-system teaching note:
 * `tokens.ts` stores raw design values, and this file turns those values into the runtime theme
 * object shared by the React tree.
 *
 * Why this layer exists:
 * changing colors, spacing, or fonts in one place is easier than hunting through every component.
 */
import { createContext, createElement, useContext } from "react";
import type { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";

import { createTypography, darkPalette, lightPalette, radii, spacing } from "@/theme/tokens";
import type { AppLanguage, ThemePreference } from "@/types/domain";

export type AppThemeMode = "light" | "dark";

type Palette = typeof lightPalette | typeof darkPalette;

export type AppTheme = {
  mode: AppThemeMode;
  isDark: boolean;
  colors: Palette;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: ReturnType<typeof createTypography>;
};

/** Build the runtime theme object for the requested light/dark mode. */
export const createAppTheme = (mode: AppThemeMode, language: AppLanguage): AppTheme => ({
  mode,
  isDark: mode === "dark",
  colors: mode === "dark" ? darkPalette : lightPalette,
  spacing,
  radii,
  typography: createTypography(language)
});

/** Resolve whether the app should use light or dark mode right now. */
export const resolveThemeMode = (
  preference: ThemePreference,
  systemScheme: "light" | "dark" | null | undefined
): AppThemeMode => {
  if (preference === "light" || preference === "dark") {
    return preference;
  }
  return systemScheme === "dark" ? "dark" : "light";
};

const defaultTheme = createAppTheme("light", "en");
const ThemeContext = createContext<AppTheme>(defaultTheme);

/** Provide the current theme to the React component tree. */
export const AppThemeProvider = ({
  theme,
  children
}: PropsWithChildren<{
  theme: AppTheme;
}>) => createElement(ThemeContext.Provider, { value: theme }, children);

/** Read the current app theme from React context. */
export const useAppTheme = () => useContext(ThemeContext);

/** Build common reusable style fragments shared by multiple screens/components. */
export const createSharedStyles = (theme: AppTheme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.ivory
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      shadowColor: theme.colors.shadow,
      shadowOpacity: 1,
      shadowOffset: { width: 0, height: 12 },
      shadowRadius: 24,
      elevation: 3
    }
  });
