import type { PropsWithChildren, ReactNode } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/theme";

type ScreenContainerProps = PropsWithChildren<{
  scroll?: boolean;
  header?: ReactNode;
}>;

const PANCHANGA_YEAR_LABEL = "Sri ParaAbhava Nama Samvatsara Panchanga";

export const ScreenContainer = ({ children, scroll = true, header }: ScreenContainerProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const content = (
    <View style={styles.body}>
      <View style={styles.yearBanner}>
        <Text style={styles.yearBannerText}>{PANCHANGA_YEAR_LABEL}</Text>
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
      fontSize: 14,
      fontWeight: "700",
      textAlign: "center"
    }
  });
