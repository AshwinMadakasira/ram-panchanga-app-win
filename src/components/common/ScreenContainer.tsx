/*
 * Component teaching note:
 * Screen wrappers are useful because most screens need the same safe area, background, padding,
 * and top banner. Centralizing that here keeps the actual screen files shorter and more readable.
 */
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { PropsWithChildren } from "react";
import { Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

// Theme values are shared through React context, so this wrapper can style every screen consistently.
import { getYearBannerLabel, useAppLanguage } from "@/i18n";
import { useAppTheme } from "@/theme";

type ScreenContainerProps = PropsWithChildren<{
  scroll?: boolean;
  title?: string;
  showSearch?: boolean;
  showBack?: boolean;
}>;

/** Wrap a screen with safe-area handling, a shared year label, and an optional in-screen header row. */
export const ScreenContainer = ({
  children,
  scroll = true,
  title,
  showSearch = false,
  showBack = false
}: ScreenContainerProps) => {
  const theme = useAppTheme();
  const language = useAppLanguage();
  const styles = createStyles(theme, language);
  const hasHeaderRow = Boolean(title || showSearch || showBack);
  const content = (
    <View style={[styles.body, !scroll && styles.bodyFill]}>
      <View style={styles.yearBanner}>
        <Text style={styles.yearBannerText}>{getYearBannerLabel(language)}</Text>
      </View>
      {hasHeaderRow ? (
        <View style={styles.headerRow}>
          <View style={styles.headerTitleWrap}>
            {showBack ? (
              <Pressable onPress={() => router.back()} style={styles.iconButton}>
                <Ionicons color={theme.colors.ink} name="arrow-back" size={24} />
              </Pressable>
            ) : null}
            {title ? <Text style={styles.headerTitle}>{title}</Text> : null}
          </View>
          {showSearch ? (
            <Pressable onPress={() => router.push("/search")} style={styles.iconButton}>
              <Ionicons color={theme.colors.ink} name="search-outline" size={22} />
            </Pressable>
          ) : (
            <View style={styles.iconButtonSpacer} />
          )}
        </View>
      ) : null}
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      {scroll ? <ScrollView contentContainerStyle={styles.scrollContent}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
};

/** Build this component's theme-aware styles. */
const createStyles = (theme: ReturnType<typeof useAppTheme>, language: ReturnType<typeof useAppLanguage>) =>
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
      gap: theme.spacing.sm,
      paddingTop:
        Platform.OS === "android"
          ? Math.max(theme.spacing.xl, (StatusBar.currentHeight ?? 0) + theme.spacing.md)
          : theme.spacing.xl
    },
    bodyFill: {
      flex: 1
    },
    yearBanner: {
      alignSelf: "center",
      backgroundColor: theme.isDark ? theme.colors.maroon : "#dac79a",
      borderColor: theme.isDark ? theme.colors.gold : "rgba(122, 46, 35, 0.18)",
      borderWidth: 1,
      borderRadius: theme.radii.pill,
      maxWidth: "72%",
      paddingHorizontal: 14,
      paddingVertical: 10
    },
    yearBannerText: {
      color: theme.isDark ? theme.colors.gold : theme.colors.maroon,
      fontFamily: theme.typography.headingFamily,
      fontSize: Math.round(18 * theme.typography.headingScale),
      lineHeight: Math.round(22 * theme.typography.headingScale),
      letterSpacing: 1,
      textAlign: "center",
      textTransform: "uppercase"
    },
    headerRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      minHeight: 52
    },
    headerTitleWrap: {
      alignItems: "center",
      flexDirection: "row",
      flex: 1,
      gap: theme.spacing.xs
    },
    headerTitle: {
      color: theme.colors.ink,
      fontFamily: theme.typography.headingFamily,
      fontSize: Math.round((language === "kn" ? 18 : 21) * theme.typography.headingScale),
      lineHeight: Math.round((language === "kn" ? 24 : 30) * theme.typography.headingScale),
      includeFontPadding: false,
      paddingTop: language === "kn" ? 1 : 0
    },
    iconButton: {
      alignItems: "center",
      height: 36,
      justifyContent: "center",
      width: 36
    },
    iconButtonSpacer: {
      height: 36,
      width: 36
    }
  });
