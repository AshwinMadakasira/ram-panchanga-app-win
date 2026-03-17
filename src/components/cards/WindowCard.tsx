/*
 * Component teaching note:
 * This card formats one named time window such as Rahukalam.
 * Keeping it separate avoids repeating the same small layout pattern on multiple screens.
 */
import { StyleSheet, Text, View } from "react-native";

// This component expects a single time-window record and formats it consistently.
import type { TimeWindow } from "@/types/domain";
import { useAppTheme } from "@/theme";

/** Render one time window such as Rahukalam or Abhijit. */
export const WindowCard = ({ window }: { window: TimeWindow }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{window.type}</Text>
      <Text style={styles.time}>
        {window.startTime || "Unavailable"} - {window.endTime || "Unavailable"}
      </Text>
      {window.notes ? <Text style={styles.notes}>{window.notes}</Text> : null}
    </View>
  );
};

/** Build this component's theme-aware styles. */
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.cardMuted,
      borderRadius: theme.radii.md,
      padding: theme.spacing.md,
      gap: 4
    },
    title: {
      color: theme.colors.ink,
      fontSize: 16,
      fontWeight: "700",
      textTransform: "capitalize",
      fontFamily: theme.typography.headingFamily
    },
    time: {
      color: theme.colors.maroon,
      fontWeight: "700",
      fontFamily: theme.typography.bodyFamily
    },
    notes: {
      color: theme.colors.muted,
      fontFamily: theme.typography.bodyFamily
    }
  });
