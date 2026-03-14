import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/theme";

type LoadingStateProps = {
  title?: string;
  message?: string;
};

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
      fontWeight: "700",
      fontFamily: theme.typography.headingFamily
    },
    message: {
      color: theme.colors.muted,
      textAlign: "center",
      lineHeight: 22,
      fontFamily: theme.typography.bodyFamily
    }
  });
