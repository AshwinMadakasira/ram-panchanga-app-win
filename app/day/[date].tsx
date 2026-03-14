import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { DateHero } from "@/components/cards/DateHero";
import { MuhurthaCard } from "@/components/cards/MuhurthaCard";
import { PanchangaSummaryCard } from "@/components/cards/PanchangaSummaryCard";
import { SunCard } from "@/components/cards/SunCard";
import { WindowCard } from "@/components/cards/WindowCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SpecialTithiList } from "@/components/day/SpecialTithiList";
import { TransitionTimeline } from "@/components/day/TransitionTimeline";
import { useDayDetails } from "@/hooks/usePanchangaQueries";
import { useSelectedLocation } from "@/hooks/useSelectedLocation";
import { useAppTheme } from "@/theme";

export default function DayDetailScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { date } = useLocalSearchParams<{ date: string }>();
  const [showRawDetails, setShowRawDetails] = useState(false);
  const { location, locationId, isLoading: locationLoading, error: locationError } = useSelectedLocation();
  const { data, error, isLoading } = useDayDetails(date, locationId);
  const highlightedWindowTypes = ["braahmi-kaala", "morning-sandhya", "evening-sandhya"];
  const primaryWindows = data?.timeWindows.filter((window) => highlightedWindowTypes.includes(window.type)) ?? [];
  const secondaryWindows = data?.timeWindows.filter((window) => !highlightedWindowTypes.includes(window.type)) ?? [];

  return (
    <ScreenContainer>
      <DateHero
        date={date}
        subtitle={location ? `Full Panchanga detail for ${location.name}.` : "Full Panchanga detail for the selected date."}
      />
      {locationError || error ? <ErrorState message={(locationError ?? error)?.message ?? "Unable to load day detail."} /> : null}
      {locationLoading || isLoading ? (
        <LoadingState title="Loading day detail" message="Fetching summary, transitions, and special tithis for this date." />
      ) : !data ? (
        <EmptyState title="No day detail found" message="This date is not present in the local Panchanga database." />
      ) : (
        <>
          <PanchangaSummaryCard day={data.day} />
          <SunCard day={data.day} timeWindows={primaryWindows} />
          <SectionHeader title="Intraday transitions" subtitle="Tithi, nakshatra, yoga, and karana changes." />
          {data.transitions.length > 0 ? (
            <TransitionTimeline transitions={data.transitions} />
          ) : (
            <EmptyState title="No transitions found" message="No transition records are stored for this date." />
          )}
          <SectionHeader title="Special tithis and festivals" />
          {data.specialTithis.length > 0 ? (
            <SpecialTithiList specialTithis={data.specialTithis} />
          ) : (
            <EmptyState title="No special tithis found" message="No special tithis are stored for this date." />
          )}
          <SectionHeader title="Muhurtha and windows" />
          {secondaryWindows.length > 0 ? secondaryWindows.map((window) => <WindowCard key={window.id} window={window} />) : null}
          {data.muhurthas.length > 0 ? data.muhurthas.map((muhurtha) => <MuhurthaCard key={muhurtha.id} muhurtha={muhurtha} />) : null}
          {secondaryWindows.length === 0 && data.muhurthas.length === 0 ? (
            <EmptyState title="No windows found" message="No muhurtha or daily window data is stored for this date." />
          ) : null}
          <Pressable onPress={() => setShowRawDetails((current) => !current)} style={styles.debugButton}>
            <Text style={styles.debugButtonText}>{showRawDetails ? "Hide raw details" : "Show raw details"}</Text>
          </Pressable>
          {showRawDetails ? (
            <View style={styles.debugCard}>
              <Text style={styles.debugTitle}>Source notes</Text>
              <Text style={styles.debugText}>{data.day.specialTithiRawText || "No raw special tithi text stored."}</Text>
              <Text style={styles.debugTitle}>Transitions</Text>
              <Text style={styles.debugText}>
                {data.transitions.length > 0
                  ? data.transitions.map((transition) => `${transition.type}: ${transition.rawSourceText || transition.name}`).join("\n")
                  : "No raw transition details stored."}
              </Text>
              <Text style={styles.debugTitle}>Muhurthas</Text>
              <Text style={styles.debugText}>
                {data.muhurthas.length > 0
                  ? data.muhurthas.map((muhurtha) => muhurtha.rawFields || muhurtha.type).join("\n\n")
                  : "No raw muhurtha details stored."}
              </Text>
            </View>
          ) : null}
        </>
      )}
    </ScreenContainer>
  );
}

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
      fontWeight: "700",
      fontFamily: theme.typography.bodyFamily
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
      fontWeight: "700",
      fontFamily: theme.typography.headingFamily
    },
    debugText: {
      color: theme.colors.muted,
      lineHeight: 21,
      fontFamily: theme.typography.bodyFamily
    }
  });
