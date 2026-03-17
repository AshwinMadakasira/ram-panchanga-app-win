/*
 * Component teaching note:
 * This card groups astronomy-like data (sun and moon rise/set) and the highlighted sacred windows.
 * The layout was intentionally simplified so a beginner user can scan sections instead of decoding a dense grid.
 */
import { StyleSheet, Text, View } from "react-native";

// Domain types keep the component explicit about which data it needs.
import type { CalendarDay, TimeWindow } from "@/types/domain";
import { useAppTheme } from "@/theme";

const highlightedWindowTypes = ["braahmi-kaala", "morning-sandhya", "evening-sandhya"] as const;

const windowLabels: Record<(typeof highlightedWindowTypes)[number], string> = {
  "braahmi-kaala": "Braahmi Kaala",
  "morning-sandhya": "Morning Sandhya",
  "evening-sandhya": "Evening Sandhya"
};

/** Convert an optional window into a human-readable time range. */
const formatRange = (window?: TimeWindow) => {
  if (!window) {
    return "Unavailable";
  }

  return `${window.startTime || "Unavailable"} - ${window.endTime || "Unavailable"}`;
};

/** Render sun/moon rise-set data and the highlighted sacred windows when available. */
export const SunCard = ({ day, timeWindows = [] }: { day: CalendarDay; timeWindows?: TimeWindow[] }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const highlightedWindows = highlightedWindowTypes
    .map((type) => timeWindows.find((window) => window.type === type))
    .filter(Boolean) as TimeWindow[];
  const hasAstronomyData = Boolean(
    day.sunrise || day.sunset || day.moonrise || day.moonset || highlightedWindows.some((window) => window.startTime || window.endTime)
  );

  if (!hasAstronomyData) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sun and moon</Text>
      <View style={styles.celestialBlock}>
        <Text style={styles.sectionLabel}>Sun</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Rise</Text>
          <Text style={styles.value}>{day.sunrise || "Unavailable"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Set</Text>
          <Text style={styles.value}>{day.sunset || "Unavailable"}</Text>
        </View>
      </View>
      <View style={styles.celestialBlock}>
        <Text style={styles.sectionLabel}>Moon</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Rise</Text>
          <Text style={styles.value}>{day.moonrise || "Unavailable"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Set</Text>
          <Text style={styles.value}>{day.moonset || "Unavailable"}</Text>
        </View>
      </View>
      {highlightedWindows.length > 0 ? (
        <View style={styles.windowsBlock}>
          <Text style={styles.sectionLabel}>Sacred times</Text>
          {highlightedWindowTypes.map((type) => {
            const window = timeWindows.find((entry) => entry.type === type);
            return (
              <View key={type} style={styles.row}>
                <Text style={styles.label}>{windowLabels[type]}</Text>
                <Text style={styles.value}>{formatRange(window)}</Text>
              </View>
            );
          })}
        </View>
      ) : null}
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
      padding: theme.spacing.md,
      gap: theme.spacing.sm
    },
    title: {
      color: theme.colors.ink,
      fontSize: 18,
      fontWeight: "700",
      fontFamily: theme.typography.headingFamily
    },
    celestialBlock: {
      backgroundColor: theme.colors.cardMuted,
      borderRadius: theme.radii.sm,
      padding: theme.spacing.sm,
      gap: theme.spacing.xs
    },
    windowsBlock: {
      marginTop: theme.spacing.xs,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      gap: theme.spacing.sm
    },
    sectionLabel: {
      color: theme.colors.maroon,
      fontSize: 13,
      fontFamily: theme.typography.bodyStrongFamily
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: theme.spacing.md
    },
    label: {
      color: theme.colors.muted,
      fontFamily: theme.typography.bodyFamily
    },
    value: {
      color: theme.colors.ink,
      fontFamily: theme.typography.bodyStrongFamily,
      textAlign: "right",
      flexShrink: 1
    }
  });
