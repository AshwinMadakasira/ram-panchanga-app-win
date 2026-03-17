/*
 * Component teaching note:
 * This file renders one day cell inside the month calendar grid.
 * It is intentionally small so the bigger `MonthGrid` component can stay focused on layout math
 * while this component focuses on one tile's presentation and click behavior.
 */
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Types describe the expected data shape, while hooks provide shared theme values.
import { useAppLocalization } from "@/i18n";
import type { MonthSummaryDay } from "@/types/domain";
import { useAppTheme } from "@/theme";

type CalendarDayCellProps = {
  day: MonthSummaryDay | null;
  onPress: (date: string) => void;
};

/** Month cells only need the sunrise tithi label, not the time/detail suffix. */
const formatMonthCellTithi = (value: string | null) => {
  if (!value) {
    return "No tithi";
  }

  const sunriseLabel = value.split("/")[0] ?? value;
  return sunriseLabel.replace(/\s+\d{1,2}:\d{1,2}.*$/, "").trim();
};

/** Render one calendar tile. `null` days become empty spacer cells so the grid stays aligned. */
const CalendarDayCellComponent = ({ day, onPress }: CalendarDayCellProps) => {
  const theme = useAppTheme();
  const { dynamic } = useAppLocalization();
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
      <Text numberOfLines={2} style={styles.tithi}>
        {dynamic(formatMonthCellTithi(day.primaryTithiAtSunrise))}
      </Text>
    </Pressable>
  );
};

export const CalendarDayCell = memo(CalendarDayCellComponent);

/** Build this component's theme-aware styles. */
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      minHeight: 74,
      backgroundColor: "transparent",
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
      borderRightColor: theme.colors.border,
      borderRightWidth: 1,
      paddingHorizontal: 6,
      paddingVertical: 10,
      gap: 6
    },
    empty: {
      backgroundColor: "transparent",
      borderBottomColor: "transparent",
      borderRightColor: "transparent"
    },
    today: {
      borderBottomColor: theme.colors.maroon,
      borderBottomWidth: 2
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    dayNumber: {
      color: theme.colors.ink,
      fontSize: 18,
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
      fontSize: 11,
      lineHeight: 14,
      textAlign: "left",
      fontFamily: theme.typography.bodyFamily
    }
  });
