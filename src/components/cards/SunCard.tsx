import { StyleSheet, Text, View } from "react-native";

import type { CalendarDay, TimeWindow } from "@/types/domain";
import { useAppTheme } from "@/theme";

const highlightedWindowTypes = ["braahmi-kaala", "morning-sandhya", "evening-sandhya"] as const;

const windowLabels: Record<(typeof highlightedWindowTypes)[number], string> = {
  "braahmi-kaala": "Braahmi Kaala",
  "morning-sandhya": "Morning Sandhya",
  "evening-sandhya": "Evening Sandhya"
};

const formatRange = (window?: TimeWindow) => {
  if (!window) {
    return "Unavailable";
  }

  return `${window.startTime || "Unavailable"} - ${window.endTime || "Unavailable"}`;
};

export const SunCard = ({ day, timeWindows = [] }: { day: CalendarDay; timeWindows?: TimeWindow[] }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const highlightedWindows = highlightedWindowTypes
    .map((type) => timeWindows.find((window) => window.type === type))
    .filter(Boolean) as TimeWindow[];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sun and moon</Text>
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.label}>Sunrise</Text>
          <Text style={styles.value}>{day.sunrise || "Unavailable"}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.label}>Sunset</Text>
          <Text style={styles.value}>{day.sunset || "Unavailable"}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.label}>Moonrise</Text>
          <Text style={styles.value}>{day.moonrise || "Unavailable"}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.label}>Moonset</Text>
          <Text style={styles.value}>{day.moonset || "Unavailable"}</Text>
        </View>
      </View>
      {highlightedWindows.length > 0 ? (
        <View style={styles.windowsBlock}>
          <Text style={styles.sectionLabel}>Daily windows</Text>
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
    metricsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm
    },
    metricCard: {
      width: "48%",
      backgroundColor: theme.colors.cardMuted,
      borderRadius: theme.radii.sm,
      padding: theme.spacing.sm,
      gap: 4
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
      fontWeight: "700",
      fontFamily: theme.typography.bodyFamily
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
      fontWeight: "600",
      fontFamily: theme.typography.bodyFamily,
      textAlign: "right",
      flexShrink: 1
    }
  });
