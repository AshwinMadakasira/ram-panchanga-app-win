/*
 * Component teaching note:
 * This file renders one day cell inside the month calendar grid.
 * It is intentionally small so the bigger `MonthGrid` component can stay focused on layout math
 * while this component focuses on one tile's presentation and click behavior.
 */
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Types describe the expected data shape, while hooks provide shared theme values.
import type { MonthSummaryDay } from "@/types/domain";
import { useAppTheme } from "@/theme";

type CalendarDayCellProps = {
  day: MonthSummaryDay | null;
  onPress: (date: string) => void;
};

/** Render one calendar tile. `null` days become empty spacer cells so the grid stays aligned. */
const CalendarDayCellComponent = ({ day, onPress }: CalendarDayCellProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  if (!day) {
    return <View style={[styles.container, styles.empty]} />;
  }

  return (
    <Pressable
      onPress={() => onPress(day.date)}
      style={[styles.container, day.isToday && styles.today]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.dayNumber}>{day.gregorianDay}</Text>
        {day.isToday ? <View style={styles.todayDot} /> : null}
      </View>
      <Text numberOfLines={1} style={styles.tithi}>
        {day.primaryTithiAtSunrise || "No tithi"}
      </Text>
      <View style={styles.markers}>
        {day.specialTithis.slice(0, 3).map((specialTithi) => (
          <Text key={specialTithi.id} numberOfLines={1} style={styles.marker}>
            {specialTithi.name}
          </Text>
        ))}
        {day.specialTithis.length > 3 ? <Text style={styles.moreMarker}>+{day.specialTithis.length - 3} more</Text> : null}
      </View>
    </Pressable>
  );
};

export const CalendarDayCell = memo(CalendarDayCellComponent);

/** Build this component's theme-aware styles. */
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      minHeight: 110,
      flex: 1,
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.sm,
      borderWidth: 1,
      padding: 8,
      gap: 6
    },
    empty: {
      backgroundColor: "transparent",
      borderColor: "transparent"
    },
    today: {
      borderColor: theme.colors.maroon,
      backgroundColor: theme.colors.surfaceAccent
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    dayNumber: {
      color: theme.colors.ink,
      fontSize: 18,
      fontWeight: "700",
      fontFamily: theme.typography.headingFamily
    },
    todayDot: {
      width: 8,
      height: 8,
      borderRadius: theme.radii.pill,
      backgroundColor: theme.colors.maroon
    },
    tithi: {
      color: theme.colors.muted,
      fontSize: 12,
      fontFamily: theme.typography.bodyFamily
    },
    markers: {
      gap: 4,
      marginTop: 2
    },
    marker: {
      color: theme.colors.saffron,
      fontSize: 11,
      fontWeight: "600",
      fontFamily: theme.typography.bodyFamily
    },
    moreMarker: {
      color: theme.colors.muted,
      fontSize: 11,
      fontWeight: "600",
      fontFamily: theme.typography.bodyFamily
    }
  });
