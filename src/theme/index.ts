import { createContext, createElement, useContext } from "react";
import type { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";

import { darkPalette, lightPalette, radii, spacing, typography } from "@/theme/tokens";
import type { ThemePreference } from "@/types/domain";

export type AppThemeMode = "light" | "dark";

type Palette = typeof lightPalette | typeof darkPalette;

export type AppTheme = {
  mode: AppThemeMode;
  isDark: boolean;
  colors: Palette;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
};

export const createAppTheme = (mode: AppThemeMode): AppTheme => ({
  mode,
  isDark: mode === "dark",
  colors: mode === "dark" ? darkPalette : lightPalette,
  spacing,
  radii,
  typography
});

export const resolveThemeMode = (
  preference: ThemePreference,
  systemScheme: "light" | "dark" | null | undefined
): AppThemeMode => {
  if (preference === "light" || preference === "dark") {
    return preference;
  }
  return systemScheme === "dark" ? "dark" : "light";
};

const defaultTheme = createAppTheme("light");
const ThemeContext = createContext<AppTheme>(defaultTheme);

export const AppThemeProvider = ({
  theme,
  children
}: PropsWithChildren<{
  theme: AppTheme;
}>) => createElement(ThemeContext.Provider, { value: theme }, children);

export const useAppTheme = () => useContext(ThemeContext);

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
