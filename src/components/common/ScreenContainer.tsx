import type { PropsWithChildren, ReactNode } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from "react-native";

import { useAppTheme } from "@/theme";

type ScreenContainerProps = PropsWithChildren<{
  scroll?: boolean;
  header?: ReactNode;
}>;

export const ScreenContainer = ({ children, scroll = true, header }: ScreenContainerProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const content = <View style={styles.body}>{children}</View>;

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
    }
  });
