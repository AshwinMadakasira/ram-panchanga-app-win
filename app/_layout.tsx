/*
 * Architecture note for students:
 * This is the root app shell. Expo Router loads this file first, and every screen in `app/`
 * renders inside the providers created here.
 *
 * Main frontend design decisions:
 * - offline-first startup: load fonts and seed the local SQLite database before showing screens
 * - React Query for async data access
 * - Zustand for persisted user preferences
 * - a custom theme layer for consistent colors, spacing, and typography
 */
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";

// App-specific imports come after library imports. This is a common way to make file dependencies easier to scan.
import { ReminderCoordinator } from "@/components/app/ReminderCoordinator";
import { ErrorState } from "@/components/common/ErrorState";
import { useAppBootstrap } from "@/hooks/useAppBootstrap";
import { useAppLocalization } from "@/i18n";
import { useSettingsStore } from "@/store/settings-store";
import { AppThemeProvider, createAppTheme, resolveThemeMode } from "@/theme";

export default function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1
          }
        }
      })
  );
  const { isReady, error } = useAppBootstrap();
  const systemScheme = useColorScheme();
  const appLanguage = useSettingsStore((state) => state.appLanguage);
  const { text } = useAppLocalization();
  const themePreference = useSettingsStore((state) => state.themePreference);
  const theme = useMemo(
    () => createAppTheme(resolveThemeMode(themePreference, systemScheme), appLanguage),
    [appLanguage, systemScheme, themePreference]
  );
  const navigationTheme = useMemo(
    () => ({
      ...(theme.isDark ? DarkTheme : DefaultTheme),
      colors: {
        ...(theme.isDark ? DarkTheme.colors : DefaultTheme.colors),
        primary: theme.colors.maroon,
        background: theme.colors.ivory,
        card: theme.colors.card,
        text: theme.colors.ink,
        border: theme.colors.border,
        notification: theme.colors.saffron
      }
    }),
    [theme]
  );
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (error) {
    return <ErrorState title="Database startup failed" message={error.message} />;
  }

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <ActivityIndicator color={theme.colors.maroon} size="large" />
        <Text style={styles.loadingText}>{text.preparingPanchanga}</Text>
      </View>
    );
  }

  return (
    <AppThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <NavigationThemeProvider value={navigationTheme}>
          <StatusBar style={theme.isDark ? "light" : "dark"} />
          <ReminderCoordinator />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.ivory
              },
              headerShadowVisible: false,
              headerTintColor: theme.colors.ink,
              contentStyle: {
                backgroundColor: theme.colors.ivory
              },
              headerTitleStyle: {
                fontFamily: theme.typography.headingFamily
              }
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen name="search" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          </Stack>
        </NavigationThemeProvider>
      </QueryClientProvider>
    </AppThemeProvider>
  );
}

const createStyles = (theme: ReturnType<typeof createAppTheme>) =>
  // Helper functions like this keep styling code out of the main component body.
  StyleSheet.create({
    loading: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      backgroundColor: theme.colors.ivory
    },
    loadingText: {
      color: theme.colors.muted,
      fontSize: 15,
      fontFamily: theme.typography.bodyFamily
    }
  });
