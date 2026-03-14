import { useState } from "react";

import { MuhurthaCard } from "@/components/cards/MuhurthaCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { FilterBar } from "@/components/common/FilterBar";
import { LoadingState } from "@/components/common/LoadingState";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { SectionHeader } from "@/components/common/SectionHeader";
import { muhurthaTypeLabels } from "@/domain/panchanga/labels";
import { useMuhurthas } from "@/hooks/usePanchangaQueries";
import { useSelectedLocation } from "@/hooks/useSelectedLocation";
import type { MuhurthaType } from "@/types/domain";

const options = ["all", "vivaha", "upanayana", "vastu"] as const;

export default function MuhurthasScreen() {
  const { locationId, isLoading: locationLoading, error: locationError } = useSelectedLocation();
  const [type, setType] = useState<MuhurthaType>("all");
  const { data, error, isLoading } = useMuhurthas(locationId, { type });

  return (
    <ScreenContainer>
      <SectionHeader title="Muhurthas" subtitle="Browse auspicious dates by supported event type." />
      <FilterBar options={options} value={type} labelMap={muhurthaTypeLabels} onChange={setType} />
      {locationError || error ? <ErrorState message={(locationError ?? error)?.message ?? "Unable to load muhurthas."} /> : null}
      {locationLoading || isLoading ? (
        <LoadingState title="Loading muhurthas" message="Fetching auspicious dates for the selected event type." />
      ) : !data || data.length === 0 ? (
        <EmptyState
          title="No muhurthas available"
          message="Import Panchanga data to browse vivaha, upanayana, and vastu muhurthas."
        />
      ) : (
        data.map((muhurtha) => <MuhurthaCard key={muhurtha.id} muhurtha={muhurtha} />)
      )}
    </ScreenContainer>
  );
}
