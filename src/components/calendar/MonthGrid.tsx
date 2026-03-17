/*
 * Component teaching note:
 * This component turns a flat list of month-summary rows into visible calendar weeks.
 * It does not fetch data itself; it receives already-prepared items and focuses on layout.
 */
import { StyleSheet, Text, View } from "react-native";

// `getCalendarWeeks` performs the date math so this component can stay focused on rendering.
import { getCalendarWeeks } from "@/domain/dates";
import { useAppLocalization } from "@/i18n";
import type { MonthSummaryDay } from "@/types/domain";
import { useAppTheme } from "@/theme";
import { CalendarDayCell } from "@/components/calendar/CalendarDayCell";

type MonthGridProps = {
  year: number;
  month: number;
  items: MonthSummaryDay[];
  onSelectDate: (date: string) => void;
};

export const MonthGrid = ({ year, month, items, onSelectDate }: MonthGridProps) => {
  const theme = useAppTheme();
  const { locale } = useAppLocalization();
  const styles = createStyles(theme);
  const weeks = getCalendarWeeks(year, month, items);
  const weekDays = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, index + 1)))
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {weekDays.map((label) => (
          <Text key={label} style={styles.weekLabel}>
            {label}
          </Text>
        ))}
      </View>
      <View style={styles.weeks}>
        {weeks.map((week, index) => (
          <View key={`${year}-${month}-week-${index}`} style={styles.weekRow}>
            {week.map((day, dayIndex) => (
              <CalendarDayCell key={`${index}-${dayIndex}-${day?.date ?? "empty"}`} day={day} onPress={onSelectDate} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

/** Build this component's theme-aware styles. */
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.sm
    },
    headerRow: {
      flexDirection: "row"
    },
    weekLabel: {
      flex: 1,
      color: theme.colors.muted,
      fontSize: 12,
      textAlign: "center",
      fontFamily: theme.typography.bodyStrongFamily
    },
    weeks: {
      gap: 0
    },
    weekRow: {
      flexDirection: "row"
    }
  });
