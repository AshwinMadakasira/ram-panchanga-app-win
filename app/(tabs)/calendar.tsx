/*
 * Screen teaching note:
 * This screen shows how local UI state and fetched data work together.
 * `visibleMonth` is local state, `monthLabel` is derived state, and `useMonthSummary`
 * pulls the matching calendar rows from the local database.
 */
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useMemo, useState } from "react";

// Reusable components and helpers are imported instead of duplicating layout and date logic here.
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { addMonths, getCurrentYearMonthForTimezone } from "@/domain/dates";
import { useMonthSummary } from "@/hooks/usePanchangaQueries";
import { useSelectedLocation } from "@/hooks/useSelectedLocation";
import { localizeDisplayMonth, useAppLocalization } from "@/i18n";
import { useAppTheme } from "@/theme";
import { dayRoute } from "@/types/navigation";

export default function CalendarScreen() {
  const theme = useAppTheme();
  const { language, text, dynamic } = useAppLocalization();
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
    () => localizeDisplayMonth(visibleMonth.year, visibleMonth.month, language),
    [language, visibleMonth.month, visibleMonth.year]
  );
  /** Reset the calendar back to the selected location's current month. */
  const jumpToToday = () => setVisibleMonth(getCurrentYearMonthForTimezone(activeTimezone));

  return (
    <ScreenContainer scroll={false} title={text.calendar} showSearch>
      <View style={styles.screen}>
        <View style={styles.stickyChrome}>
          <View style={styles.header}>
            <Pressable
              onPress={() => setVisibleMonth((current) => addMonths(current.year, current.month, -1))}
              style={styles.navButton}
            >
              <Text style={styles.navButtonText}>{text.prev}</Text>
            </Pressable>
            <Text style={styles.headerTitle}>{monthLabel}</Text>
            <Pressable
              onPress={() => setVisibleMonth((current) => addMonths(current.year, current.month, 1))}
              style={styles.navButton}
            >
              <Text style={styles.navButtonText}>{text.next}</Text>
            </Pressable>
          </View>
          <View style={styles.subHeader}>
            <Text style={styles.subHeaderText}>{location ? dynamic(location.name) : text.selectedLocation}</Text>
            <Pressable onPress={jumpToToday} style={styles.todayButton}>
              <Text style={styles.todayButtonText}>{text.goToCurrentMonth}</Text>
            </Pressable>
          </View>
        </View>
        {locationError || error ? <ErrorState message={(locationError ?? error)?.message ?? (language === "kn" ? "ಕ್ಯಾಲೆಂಡರ್ ಅನ್ನು ಲೋಡ್ ಮಾಡಲು ಆಗಲಿಲ್ಲ." : "Unable to load calendar.")} /> : null}
        {locationLoading || isLoading ? (
          <LoadingState
            title={language === "kn" ? "ತಿಂಗಳು ಲೋಡ್ ಆಗುತ್ತಿದೆ" : "Loading month"}
            message={language === "kn" ? "ಈ ತಿಂಗಳ ಪಂಚಾಂಗ ಕ್ಯಾಲೆಂಡರ್ ಸಿದ್ಧವಾಗುತ್ತಿದೆ." : "Building the Panchanga calendar grid for this month."}
          />
        ) : !data || data.length === 0 ? (
          <EmptyState
            title={language === "kn" ? "ಈ ತಿಂಗಳಿಗೆ ದಿನಾಂಕಗಳಿಲ್ಲ" : "No dates in this month"}
            message={
              language === "kn"
                ? "ಆಯ್ದ ಸ್ಥಳಕ್ಕೆ ಪಂಚಾಂಗ ದತ್ತಾಂಶ ಇಂಪೋರ್ಟ್ ಆದ ನಂತರ ಈ ಕ್ಯಾಲೆಂಡರ್ ಸ್ವಯಂವಾಗಿ ತುಂಬುತ್ತದೆ."
                : "The calendar will fill in automatically after Panchanga data is imported for the selected location."
            }
          />
        ) : (
          <ScrollView contentContainerStyle={styles.gridContent} showsVerticalScrollIndicator={false}>
            <MonthGrid
              year={visibleMonth.year}
              month={visibleMonth.month}
              items={data}
              onSelectDate={(date) => router.push(dayRoute(date))}
            />
          </ScrollView>
        )}
      </View>
    </ScreenContainer>
  );
}

/** Build the style object for this screen from the shared theme. */
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      gap: theme.spacing.md
    },
    stickyChrome: {
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md
    },
    header: {
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
    },
    gridContent: {
      paddingBottom: theme.spacing.xl
    }
  });
