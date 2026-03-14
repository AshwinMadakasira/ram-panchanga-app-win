import { useEffect, useMemo } from "react";

import { useLocation, useLocations } from "@/hooks/usePanchangaQueries";
import { useSettingsStore } from "@/store/settings-store";

export const useSelectedLocation = () => {
  const locationId = useSettingsStore((state) => state.locationId);
  const setLocationId = useSettingsStore((state) => state.setLocationId);
  const locationsQuery = useLocations();
  const locationQuery = useLocation(locationId);

  const selectedLocation = useMemo(() => {
    if (locationQuery.data) {
      return locationQuery.data;
    }
    return locationsQuery.data?.[0] ?? null;
  }, [locationQuery.data, locationsQuery.data]);

  const effectiveLocationId = selectedLocation?.id ?? locationId;

  useEffect(() => {
    if (selectedLocation && selectedLocation.id !== locationId) {
      setLocationId(selectedLocation.id);
    }
  }, [locationId, selectedLocation, setLocationId]);

  return {
    locationId: effectiveLocationId,
    location: selectedLocation,
    locations: locationsQuery.data ?? [],
    isLoading: locationsQuery.isLoading || locationQuery.isLoading,
    error: locationsQuery.error ?? locationQuery.error
  };
};
