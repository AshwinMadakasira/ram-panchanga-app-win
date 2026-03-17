/*
 * Component teaching note:
 * Screen wrappers are useful because most screens need the same safe area, background, padding,
 * and top banner. Centralizing that here keeps the actual screen files shorter and more readable.
 */
import type { PropsWithChildren, ReactNode } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

// Theme values are shared through React context, so this wrapper can style every screen consistently.
import { getYearBannerLabel, useAppLanguage } from "@/i18n";
import { useAppTheme } from "@/theme";

type ScreenContainerProps = PropsWithChildren<{
  scroll?: boolean;
  header?: ReactNode;
}>;

/** Wrap a screen with safe-area handling, a shared banner, and optional scrolling. */
export const ScreenContainer = ({ children, scroll = true, header }: ScreenContainerProps) => {
  const theme = useAppTheme();
  const language = useAppLanguage();
  const styles = createStyles(theme);
  const content = (
    <View style={[styles.body, !scroll && styles.bodyFill]}>
      <View style={styles.yearBanner}>
        <Text style={styles.yearBannerText}>{getYearBannerLabel(language)}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      {header}
      {scroll ? <ScrollView contentContainerStyle={styles.scrollContent}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
};

/** Build this component's theme-aware styles. */
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.ivory
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl
    },
    body: {
      paddingHorizontal: theme.spacing.md,
      gap: theme.spacing.md
    },
    bodyFill: {
      flex: 1
    },
    yearBanner: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm
    },
    yearBannerText: {
      color: theme.colors.maroon,
      fontFamily: theme.typography.headingFamily,
      fontSize: Math.round(17 * theme.typography.headingScale),
      lineHeight: Math.round(24 * theme.typography.headingScale),
      textAlign: "center"
    }
  });
