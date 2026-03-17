/*
 * Component teaching note:
 * This card formats one named time window such as Rahukalam.
 * Keeping it separate avoids repeating the same small layout pattern on multiple screens.
 */
import { StyleSheet, Text, View } from "react-native";

// This component expects a single time-window record and formats it consistently.
import { useAppLocalization } from "@/i18n";
import type { TimeWindow } from "@/types/domain";
import { useAppTheme } from "@/theme";

/** Render one time window such as Rahukalam or Abhijit. */
export const WindowCard = ({ window }: { window: TimeWindow }) => {
  const theme = useAppTheme();
  const { dynamic, text } = useAppLocalization();
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{dynamic(window.type)}</Text>
      <Text style={styles.time}>
        {window.startTime || text.unavailable} - {window.endTime || text.unavailable}
      </Text>
      {window.notes ? <Text style={styles.notes}>{dynamic(window.notes)}</Text> : null}
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
      textTransform: "capitalize",
      fontFamily: theme.typography.headingFamily
    },
    time: {
      color: theme.colors.maroon,
      fontSize: 15,
      fontFamily: theme.typography.bodyStrongFamily
    },
    notes: {
      color: theme.colors.muted,
      fontSize: 15,
      fontFamily: theme.typography.bodyFamily
    }
  });
