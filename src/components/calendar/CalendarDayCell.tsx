import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { MonthSummaryDay } from "@/types/domain";
import { useAppTheme } from "@/theme";

type CalendarDayCellProps = {
  day: MonthSummaryDay | null;
  onPress: (date: string) => void;
};

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
      <Text style={styles.dayNumber}>{day.gregorianDay}</Text>
      <Text numberOfLines={1} style={styles.tithi}>
        {day.primaryTithiAtSunrise || "No tithi"}
      </Text>
      <View style={styles.markers}>
        {day.specialTithis.map((specialTithi) => (
          <Text key={specialTithi.id} numberOfLines={1} style={styles.marker}>
            {specialTithi.name}
          </Text>
        ))}
      </View>
    </Pressable>
  );
};

export const CalendarDayCell = memo(CalendarDayCellComponent);

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
    dayNumber: {
      color: theme.colors.ink,
      fontSize: 18,
      fontWeight: "700",
      fontFamily: theme.typography.headingFamily
    },
    tithi: {
      color: theme.colors.muted,
      fontSize: 12,
      fontFamily: theme.typography.bodyFamily
    },
    markers: {
      gap: 4
    },
    marker: {
      color: theme.colors.saffron,
      fontSize: 11,
      fontWeight: "600",
      fontFamily: theme.typography.bodyFamily
    }
  });
