/*
 * Component teaching note:
 * Loading states communicate that the app is working rather than frozen.
 * This project uses one shared loading card to keep that experience consistent.
 */
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

// A shared loading component avoids each screen inventing its own spinner layout.
import { useAppTheme } from "@/theme";

type LoadingStateProps = {
  title?: string;
  message?: string;
};

/** Show a standardized loading card with an optional title and message. */
export const LoadingState = ({ title = "Loading", message = "Fetching Panchanga data..." }: LoadingStateProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <ActivityIndicator color={theme.colors.maroon} size="small" />
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
      alignItems: "center",
      gap: theme.spacing.sm
    },
    title: {
      color: theme.colors.ink,
      fontSize: 17,
      fontFamily: theme.typography.headingFamily
    },
    message: {
      color: theme.colors.muted,
      fontSize: 15,
      textAlign: "center",
      lineHeight: 22,
      fontFamily: theme.typography.bodyFamily
    }
  });
