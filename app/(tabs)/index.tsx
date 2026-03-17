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
import { useAppLocalization } from "@/i18n";
import { dayRoute } from "@/types/navigation";

const highlightedWindowTypes = new Set(["braahmi-kaala", "morning-sandhya", "evening-sandhya"]);

export default function HomeScreen() {
  const { language, dynamic } = useAppLocalization();
  const { location, locationId, isLoading: locationLoading, error: locationError } = useSelectedLocation();
  const today = useMemo(() => getTodayForTimezone(location?.timezone ?? "America/Vancouver"), [location?.timezone]);
  const { data, error, isLoading } = useDayDetails(today, locationId);
  const highlightedWindows = data?.timeWindows.filter((window) => highlightedWindowTypes.has(window.type)) ?? [];
  const secondaryWindows = data?.timeWindows.filter((window) => !highlightedWindowTypes.has(window.type)) ?? [];
  const hasSecondaryWindows = secondaryWindows.length > 0;

  if (locationError || error) {
    return (
      <ScreenContainer>
        <ErrorState message={(locationError ?? error)?.message ?? (language === "kn" ? "ಇಂದಿನ ಪಂಚಾಂಗವನ್ನು ಲೋಡ್ ಮಾಡಲು ಆಗಲಿಲ್ಲ." : "Unable to load today.")} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <DateHero
        date={today}
        subtitle={
          location
            ? (dynamic(location.name) ?? location.name)
            : language === "kn"
              ? "ಸೂರ್ಯೋದಯ ಆಧಾರಿತ ಇಂದಿನ ಪಂಚಾಂಗ."
              : "Today at sunrise, with special tithis and daily windows."
        }
      />
      {locationLoading || isLoading ? (
        <LoadingState
          title={language === "kn" ? "ಇಂದು ಲೋಡ್ ಆಗುತ್ತಿದೆ" : "Loading today"}
          message={language === "kn" ? "ಇಂದಿನ ಪಂಚಾಂಗ ಸಾರಾಂಶ ಮತ್ತು ಕಾಲಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ." : "Preparing today's Panchanga summary and daily windows."}
        />
      ) : !data ? (
        <EmptyState
          title={language === "kn" ? "ಇಂದಿನ ಪಂಚಾಂಗ ದತ್ತಾಂಶ ಲಭ್ಯವಿಲ್ಲ" : "No Panchanga data for today"}
          message={
            language === "kn"
              ? "ಸ್ಥಳೀಯ ಡೇಟಾಬೇಸ್ ತುಂಬಲು ಪಂಚಾಂಗ ಮೂಲ ದತ್ತಾಂಶವನ್ನು ಇಂಪೋರ್ಟ್ ಮಾಡಿ. ಅಷ್ಟರವರೆಗೆ ಆಪ್ ಖಾಲಿ ಸ್ಥಿತಿಗಳನ್ನು ಮಾತ್ರ ತೋರಿಸುತ್ತದೆ."
              : "Import the extracted Panchanga source files to populate the local database. Until then the app stays fully navigable and shows empty states instead of placeholder values."
          }
        />
      ) : (
        <>
          <PanchangaSummaryCard day={data.day} />
          <SunCard day={data.day} timeWindows={highlightedWindows} />
          <SectionHeader title={language === "kn" ? "ಇಂದಿನ ವಿಶೇಷ ತಿಥಿಗಳು" : "Today's special tithis"} />
          {data.specialTithis.length > 0 ? (
            <SpecialTithiList specialTithis={data.specialTithis} />
          ) : (
            <EmptyState
              title={language === "kn" ? "ವಿಶೇಷ ತಿಥಿಗಳು ಲಭ್ಯವಿಲ್ಲ" : "No special tithis found"}
              message={language === "kn" ? "ಈ ದಿನಾಂಕಕ್ಕೆ ವಿಶೇಷ ತಿಥಿಗಳು ಸಂಗ್ರಹದಲ್ಲಿಲ್ಲ." : "No special tithis are stored for this date."}
            />
          )}
          {hasSecondaryWindows ? (
            <SectionHeader
              title={language === "kn" ? "ಪ್ರಮುಖ ಕಾಲಗಳು" : "Important windows"}
              subtitle={language === "kn" ? "ರಾಹುಕಾಲ ಮತ್ತು ಇತರ ಸಂಗ್ರಹಿತ ಕಾಲಗಳು." : "Rahukalam and other stored windows."}
            />
          ) : null}
          {hasSecondaryWindows ? secondaryWindows.map((window) => <WindowCard key={window.id} window={window} />) : null}
          <PrimaryTextLink href={dayRoute(today)} label={language === "kn" ? "ಪೂರ್ಣ ದಿನದ ವಿವರ ತೆರೆ" : "Open full day detail"} />
        </>
      )}
    </ScreenContainer>
  );
}
