/*
 * Component teaching note:
 * Empty states are an explicit design choice. Instead of blank screens, the app explains why no data is shown.
 */
import { StyleSheet, Text, View } from "react-native";

// The only dependency here is the shared theme, which keeps the component lightweight and reusable.
import { useAppTheme } from "@/theme";

type EmptyStateProps = {
  title: string;
  message: string;
};

/** Show a standardized "there is no data here" message. */
export const EmptyState = ({ title, message }: EmptyStateProps) => {
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
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      padding: theme.spacing.lg,
      gap: theme.spacing.sm
    },
    title: {
      color: theme.colors.ink,
      fontSize: 18,
      fontWeight: "700",
      fontFamily: theme.typography.headingFamily
    },
    message: {
      color: theme.colors.muted,
      fontSize: 15,
      lineHeight: 22,
      fontFamily: theme.typography.bodyFamily
    }
  });
