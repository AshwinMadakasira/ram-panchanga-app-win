/*
 * Screen teaching note:
 * This is the detailed drill-down route for one exact date.
 * The Today screen is optimized for speed; this screen is optimized for completeness.
 */
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// The day-detail route is composed from smaller cards and lists, which keeps the main screen readable.
import { DateHero } from "@/components/cards/DateHero";
import { PanchangaSummaryCard } from "@/components/cards/PanchangaSummaryCard";
import { WindowCard } from "@/components/cards/WindowCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SpecialTithiList } from "@/components/day/SpecialTithiList";
import { TransitionTimeline, type TransitionTimelineEntry } from "@/components/day/TransitionTimeline";
import { useDayDetails } from "@/hooks/usePanchangaQueries";
import { useSelectedLocation } from "@/hooks/useSelectedLocation";
import { useAppLocalization } from "@/i18n";
import { useAppTheme } from "@/theme";
import type { TimeWindow } from "@/types/domain";

const highlightedWindowTypes = ["braahmi-kaala", "morning-sandhya", "evening-sandhya"] as const;

const formatTransitionDetail = (startsAt: string | null, endsAt: string | null) => {
  if (startsAt && endsAt) {
    return `${startsAt} to ${endsAt}`;
  }

  if (endsAt) {
    return `Until ${endsAt}`;
  }

  if (startsAt) {
    return `From ${startsAt}`;
  }

  return "Time not listed";
};

const formatWindowDetail = (window: TimeWindow | undefined, unavailableLabel: string) => {
  if (!window) {
    return unavailableLabel;
  }

  return `${window.startTime || unavailableLabel} - ${window.endTime || unavailableLabel}`;
};

const isHighlightedWindowType = (value: string): value is (typeof highlightedWindowTypes)[number] =>
  highlightedWindowTypes.includes(value as (typeof highlightedWindowTypes)[number]);

export default function DayDetailScreen() {
  const theme = useAppTheme();
  const { language, text, dynamic } = useAppLocalization();
  const styles = createStyles(theme);
  const { date } = useLocalSearchParams<{ date: string }>();
  const [showRawDetails, setShowRawDetails] = useState(false);
  const { location, locationId, isLoading: locationLoading, error: locationError } = useSelectedLocation();
  const { data, error, isLoading } = useDayDetails(date, locationId);
  const primaryWindows = useMemo(
    () => data?.timeWindows.filter((window) => isHighlightedWindowType(window.type)) ?? [],
    [data]
  );
  const secondaryWindows = useMemo(
    () => data?.timeWindows.filter((window) => !isHighlightedWindowType(window.type)) ?? [],
    [data]
  );
  const hasSecondaryWindows = secondaryWindows.length > 0;
  const intradayItems = useMemo<TransitionTimelineEntry[]>(() => {
    if (!data) {
      return [];
    }

    const astronomicalItems: TransitionTimelineEntry[] = [
      {
        id: `${data.day.id}-sunrise`,
        type: text.sun,
        name: language === "kn" ? "ಸೂರ್ಯೋದಯ" : "Sunrise",
        detail: data.day.sunrise || text.unavailable
      },
      {
        id: `${data.day.id}-sunset`,
        type: text.sun,
        name: language === "kn" ? "ಸೂರ್ಯಾಸ್ತ" : "Sunset",
        detail: data.day.sunset || text.unavailable
      },
      {
        id: `${data.day.id}-moonrise`,
        type: text.moon,
        name: language === "kn" ? "ಚಂದ್ರೋದಯ" : "Moonrise",
        detail: data.day.moonrise || text.unavailable
      },
      {
        id: `${data.day.id}-moonset`,
        type: text.moon,
        name: language === "kn" ? "ಚಂದ್ರಾಸ್ತ" : "Moonset",
        detail: data.day.moonset || text.unavailable
      }
    ];

    const sacredTimeItems: TransitionTimelineEntry[] = highlightedWindowTypes.map((type) => ({
      id: `${data.day.id}-${type}`,
      type: language === "kn" ? "ಪವಿತ್ರ ಕಾಲ" : "Sacred time",
      name: type === "braahmi-kaala" ? text.braahmiKaala : type === "morning-sandhya" ? text.morningSandhya : text.eveningSandhya,
      detail: formatWindowDetail(primaryWindows.find((window) => window.type === type), text.unavailable)
    }));

    const transitionItems: TransitionTimelineEntry[] = data.transitions.map((transition) => ({
      id: transition.id,
      type: dynamic(transition.type) || transition.type,
      name: dynamic(transition.name) || transition.name,
      detail:
        startsAtLabel(transition.startsAt, transition.endsAt, language) ??
        formatTransitionDetail(transition.startsAt, transition.endsAt)
    }));

    return [...astronomicalItems, ...sacredTimeItems, ...transitionItems];
  }, [data, dynamic, language, primaryWindows, text.braahmiKaala, text.moon, text.morningSandhya, text.sun, text.unavailable, text.eveningSandhya]);

  return (
    <ScreenContainer>
      <DateHero
        date={date}
        subtitle={
          location
            ? language === "kn"
              ? `${dynamic(location.name)} ಸ್ಥಳದ ಸಂಪೂರ್ಣ ಪಂಚಾಂಗ ವಿವರ.`
              : `Full Panchanga detail for ${dynamic(location.name)}.`
            : language === "kn"
              ? "ಆಯ್ದ ದಿನಾಂಕದ ಸಂಪೂರ್ಣ ಪಂಚಾಂಗ ವಿವರ."
              : "Full Panchanga detail for the selected date."
        }
      />
      {locationError || error ? <ErrorState message={(locationError ?? error)?.message ?? (language === "kn" ? "ದಿನದ ವಿವರವನ್ನು ಲೋಡ್ ಮಾಡಲು ಆಗಲಿಲ್ಲ." : "Unable to load day detail.")} /> : null}
      {locationLoading || isLoading ? (
        <LoadingState
          title={language === "kn" ? "ದಿನದ ವಿವರ ಲೋಡ್ ಆಗುತ್ತಿದೆ" : "Loading day detail"}
          message={language === "kn" ? "ಈ ದಿನಾಂಕದ ಸಾರಾಂಶ, ಪರಿವರ್ತನೆಗಳು ಮತ್ತು ವಿಶೇಷ ತಿಥಿಗಳನ್ನು ತರಲಾಗುತ್ತಿದೆ." : "Fetching summary, transitions, and special tithis for this date."}
        />
      ) : !data ? (
        <EmptyState
          title={language === "kn" ? "ದಿನದ ವಿವರ ಲಭ್ಯವಿಲ್ಲ" : "No day detail found"}
          message={language === "kn" ? "ಈ ದಿನಾಂಕ ಸ್ಥಳೀಯ ಪಂಚಾಂಗ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಇಲ್ಲ." : "This date is not present in the local Panchanga database."}
        />
      ) : (
        <>
          <PanchangaSummaryCard day={data.day} />
          <SectionHeader
            title={language === "kn" ? "ದಿನದೊಳಗಿನ ಪರಿವರ್ತನೆಗಳು" : "Intraday transitions"}
            subtitle={language === "kn" ? "ಸೂರ್ಯ, ಚಂದ್ರ, ಪವಿತ್ರ ಕಾಲಗಳು ಮತ್ತು ಪಂಚಾಂಗ ಬದಲಾವಣೆಗಳು." : "Sun, moon, sacred windows, and Panchanga changes."}
          />
          {intradayItems.length > 0 ? (
            <TransitionTimeline items={intradayItems} />
          ) : (
            <EmptyState
              title={language === "kn" ? "ದಿನದೊಳಗಿನ ವಿವರಗಳಿಲ್ಲ" : "No intraday details found"}
              message={language === "kn" ? "ಈ ದಿನಾಂಕಕ್ಕೆ ದಿನದೊಳಗಿನ ಪರಿವರ್ತನೆ ದಾಖಲೆಗಳಿಲ್ಲ." : "No intraday transition records are stored for this date."}
            />
          )}
          <SectionHeader title={language === "kn" ? "ವಿಶೇಷ ತಿಥಿಗಳು ಮತ್ತು ಹಬ್ಬಗಳು" : "Special tithis and festivals"} />
          {data.specialTithis.length > 0 ? (
            <SpecialTithiList specialTithis={data.specialTithis} />
          ) : (
            <EmptyState
              title={language === "kn" ? "ವಿಶೇಷ ತಿಥಿಗಳು ಇಲ್ಲ" : "No special tithis found"}
              message={language === "kn" ? "ಈ ದಿನಾಂಕಕ್ಕೆ ವಿಶೇಷ ತಿಥಿಗಳು ಸಂಗ್ರಹದಲ್ಲಿಲ್ಲ." : "No special tithis are stored for this date."}
            />
          )}
          {hasSecondaryWindows ? <SectionHeader title={language === "kn" ? "ದಿನದ ಕಾಲಗಳು" : "Daily windows"} /> : null}
          {hasSecondaryWindows ? secondaryWindows.map((window) => <WindowCard key={window.id} window={window} />) : null}
          <Pressable onPress={() => setShowRawDetails((current) => !current)} style={styles.debugButton}>
            <Text style={styles.debugButtonText}>{showRawDetails ? (language === "kn" ? "ಮೂಲ ವಿವರಗಳನ್ನು ಅಡಗಿ" : "Hide raw details") : language === "kn" ? "ಮೂಲ ವಿವರಗಳನ್ನು ತೋರಿಸಿ" : "Show raw details"}</Text>
          </Pressable>
          {showRawDetails ? (
            <View style={styles.debugCard}>
              <Text style={styles.debugTitle}>{language === "kn" ? "ಮೂಲ ಟಿಪ್ಪಣಿಗಳು" : "Source notes"}</Text>
              <Text style={styles.debugText}>{dynamic(data.day.specialTithiRawText) || (language === "kn" ? "ಮೂಲ ವಿಶೇಷ ತಿಥಿ ಪಠ್ಯ ಸಂಗ್ರಹದಲ್ಲಿಲ್ಲ." : "No raw special tithi text stored.")}</Text>
              <Text style={styles.debugTitle}>{language === "kn" ? "ಪರಿವರ್ತನೆಗಳು" : "Transitions"}</Text>
              <Text style={styles.debugText}>
                {data.transitions.length > 0
                  ? data.transitions
                      .map((transition) => `${dynamic(transition.type) || transition.type}: ${dynamic(transition.rawSourceText || transition.name)}`)
                      .join("\n")
                  : language === "kn"
                    ? "ಮೂಲ ಪರಿವರ್ತನೆ ವಿವರಗಳು ಸಂಗ್ರಹದಲ್ಲಿಲ್ಲ."
                    : "No raw transition details stored."}
              </Text>
            </View>
          ) : null}
        </>
      )}
    </ScreenContainer>
  );
}

/** Create theme-aware styles for the day-detail screen. */
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    debugButton: {
      alignSelf: "flex-start",
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.pill,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 10
    },
    debugButtonText: {
      color: theme.colors.maroon,
      fontFamily: theme.typography.bodyStrongFamily
    },
    debugCard: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      padding: theme.spacing.md,
      gap: theme.spacing.sm
    },
    debugTitle: {
      color: theme.colors.ink,
      fontSize: 15,
      fontFamily: theme.typography.headingFamily
    },
    debugText: {
      color: theme.colors.muted,
      lineHeight: 21,
      fontFamily: theme.typography.bodyFamily
    }
  });

const startsAtLabel = (startsAt: string | null, endsAt: string | null, language: "en" | "kn") => {
  if (language === "en") {
    return null;
  }

  if (startsAt && endsAt) {
    return `${startsAt} ರಿಂದ ${endsAt}`;
  }

  if (endsAt) {
    return `${endsAt} ತನಕ`;
  }

  if (startsAt) {
    return `${startsAt} ರಿಂದ`;
  }

  return "ಸಮಯ ಲಭ್ಯವಿಲ್ಲ";
};
