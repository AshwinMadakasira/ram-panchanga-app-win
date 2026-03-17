/*
 * Screen teaching note:
 * This is the "Today" screen. It is intentionally organized as a dashboard of the most important
 * daily information for one selected location and one selected day.
 *
 * Architecture flow:
 * UI screen -> React hook -> repository -> SQLite -> bundled seed data.
 */
import { useMemo } from "react";

// The home screen is mostly composition: it imports reusable sections instead of building everything inline.
import { DateHero } from "@/components/cards/DateHero";
import { PanchangaSummaryCard } from "@/components/cards/PanchangaSummaryCard";
import { SunCard } from "@/components/cards/SunCard";
import { WindowCard } from "@/components/cards/WindowCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { PrimaryTextLink } from "@/components/common/PrimaryTextLink";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SpecialTithiList } from "@/components/day/SpecialTithiList";
import { getTodayForTimezone } from "@/domain/dates";
import { useDayDetails } from "@/hooks/usePanchangaQueries";
import { useSelectedLocation } from "@/hooks/useSelectedLocation";
import { dayRoute } from "@/types/navigation";

const highlightedWindowTypes = new Set(["braahmi-kaala", "morning-sandhya", "evening-sandhya"]);

export default function HomeScreen() {
  const { location, locationId, isLoading: locationLoading, error: locationError } = useSelectedLocation();
  const today = useMemo(() => getTodayForTimezone(location?.timezone ?? "America/Vancouver"), [location?.timezone]);
  const { data, error, isLoading } = useDayDetails(today, locationId);
  const highlightedWindows = data?.timeWindows.filter((window) => highlightedWindowTypes.has(window.type)) ?? [];
  const secondaryWindows = data?.timeWindows.filter((window) => !highlightedWindowTypes.has(window.type)) ?? [];

  if (locationError || error) {
    return (
      <ScreenContainer>
        <ErrorState message={(locationError ?? error)?.message ?? "Unable to load today."} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <DateHero
        date={today}
        subtitle={
          location
            ? `${location.name}, ${location.region ?? location.country ?? ""}`
            : "Today at sunrise, with special tithis and daily windows."
        }
      />
      {locationLoading || isLoading ? (
        <LoadingState title="Loading today" message="Preparing today's Panchanga summary and daily windows." />
      ) : !data ? (
        <EmptyState
          title="No Panchanga data for today"
          message="Import the extracted Panchanga source files to populate the local database. Until then the app stays fully navigable and shows empty states instead of placeholder values."
        />
      ) : (
        <>
          <PanchangaSummaryCard day={data.day} />
          <SunCard day={data.day} timeWindows={highlightedWindows} />
          <SectionHeader title="Today's special tithis" />
          {data.specialTithis.length > 0 ? (
            <SpecialTithiList specialTithis={data.specialTithis} />
          ) : (
            <EmptyState title="No special tithis found" message="No special tithis are stored for this date." />
          )}
          <SectionHeader title="Important windows" subtitle="Rahukalam and other stored windows." />
          {secondaryWindows.length > 0 ? (
            secondaryWindows.map((window) => <WindowCard key={window.id} window={window} />)
          ) : (
            <EmptyState title="No windows found" message="No time windows are stored for this date." />
          )}
          <PrimaryTextLink href={dayRoute(today)} label="Open full day detail" />
        </>
      )}
    </ScreenContainer>
  );
}
