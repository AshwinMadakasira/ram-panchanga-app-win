/*
 * Component teaching note:
 * This component standardizes how failures are shown so screens do not invent different error UIs.
 */
import { StyleSheet, Text, View } from "react-native";

// Error styling is centralized so failures look and feel consistent.
import { useAppTheme } from "@/theme";

type ErrorStateProps = {
  title?: string;
  message: string;
};

/** Show a standardized error message card. */
export const ErrorState = ({ title = "Something went wrong", message }: ErrorStateProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

/** Build this component's theme-aware styles. */
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.isDark ? "#3a221f" : "#fff1ed",
      borderColor: theme.isDark ? "#73413b" : "#efc6be",
      borderRadius: theme.radii.md,
      borderWidth: 1,
      padding: theme.spacing.lg,
      gap: theme.spacing.sm
    },
    title: {
      color: theme.colors.danger,
      fontSize: 18,
      fontFamily: theme.typography.headingFamily
    },
    message: {
      color: theme.colors.muted,
      fontSize: 15,
      fontFamily: theme.typography.bodyFamily
    }
  });
