/*
 * Screen teaching note:
 * This screen shows how local UI state and fetched data work together.
 * `visibleMonth` is local state, `monthLabel` is derived state, and `useMonthSummary`
 * pulls the matching calendar rows from the local database.
 */
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useMemo, useState } from "react";

// Reusable components and helpers are imported instead of duplicating layout and date logic here.
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { addMonths, getCurrentYearMonthForTimezone, getDisplayMonth } from "@/domain/dates";
import { useMonthSummary } from "@/hooks/usePanchangaQueries";
import { useSelectedLocation } from "@/hooks/useSelectedLocation";
import { useAppTheme } from "@/theme";
import { dayRoute } from "@/types/navigation";

export default function CalendarScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { location, locationId, isLoading: locationLoading, error: locationError } = useSelectedLocation();
  const activeTimezone = location?.timezone ?? "America/Vancouver";
  const [visibleMonth, setVisibleMonth] = useState(() => getCurrentYearMonthForTimezone(activeTimezone));
  const { data, error, isLoading } = useMonthSummary(
    visibleMonth.year,
    visibleMonth.month,
    locationId,
    activeTimezone
  );
  useEffect(() => {
    setVisibleMonth((current) => {
      const nowInTimezone = getCurrentYearMonthForTimezone(activeTimezone);
      return current.year === nowInTimezone.year && current.month === nowInTimezone.month ? current : nowInTimezone;
    });
  }, [activeTimezone]);

  const monthLabel = useMemo(
    () => getDisplayMonth(visibleMonth.year, visibleMonth.month),
    [visibleMonth.month, visibleMonth.year]
  );
  /** Reset the calendar back to the selected location's current month. */
  const jumpToToday = () => setVisibleMonth(getCurrentYearMonthForTimezone(activeTimezone));

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Pressable
          onPress={() => setVisibleMonth((current) => addMonths(current.year, current.month, -1))}
          style={styles.navButton}
        >
          <Text style={styles.navButtonText}>Prev</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{monthLabel}</Text>
        <Pressable
          onPress={() => setVisibleMonth((current) => addMonths(current.year, current.month, 1))}
          style={styles.navButton}
        >
          <Text style={styles.navButtonText}>Next</Text>
        </Pressable>
      </View>
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>{location ? location.name : "Selected location"}</Text>
        <Pressable onPress={jumpToToday} style={styles.todayButton}>
          <Text style={styles.todayButtonText}>Go to current month</Text>
        </Pressable>
      </View>
      {locationError || error ? <ErrorState message={(locationError ?? error)?.message ?? "Unable to load calendar."} /> : null}
      {locationLoading || isLoading ? (
        <LoadingState title="Loading month" message="Building the Panchanga calendar grid for this month." />
      ) : !data || data.length === 0 ? (
        <EmptyState
          title="No dates in this month"
          message="The calendar will fill in automatically after Panchanga data is imported for the selected location."
        />
      ) : (
        <MonthGrid
          year={visibleMonth.year}
          month={visibleMonth.month}
          items={data}
          onSelectDate={(date) => router.push(dayRoute(date))}
        />
      )}
    </ScreenContainer>
  );
}

/** Build the style object for this screen from the shared theme. */
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    header: {
      marginTop: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    headerTitle: {
      color: theme.colors.ink,
      fontSize: 24,
      fontFamily: theme.typography.headingFamily
    },
    subHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.sm
    },
    subHeaderText: {
      color: theme.colors.muted,
      fontFamily: theme.typography.bodyFamily
    },
    navButton: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.pill,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 10
    },
    todayButton: {
      backgroundColor: theme.colors.cardMuted,
      borderRadius: theme.radii.pill,
      paddingHorizontal: 12,
      paddingVertical: 8
    },
    todayButtonText: {
      color: theme.colors.maroon,
      fontSize: 12,
      fontFamily: theme.typography.bodyStrongFamily
    },
    navButtonText: {
      color: theme.colors.maroon,
      fontFamily: theme.typography.bodyStrongFamily
    }
  });
