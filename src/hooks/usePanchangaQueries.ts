/*
 * Hook-layer teaching note:
 * These functions are thin adapters around repository methods.
 * Screens use them so UI code can stay focused on rendering instead of caching rules.
 *
 * Architecture rule:
 * screens -> hooks -> repositories -> SQLite
 */
import { useQuery } from "@tanstack/react-query";

// Query hooks translate "what data does this screen need?" into cacheable query definitions.
import { getTodayForTimezone } from "@/domain/dates";
import { panchangaRepository } from "@/db/repositories/panchanga-repository";
import { searchRepository } from "@/db/repositories/search-repository";
import type { MuhurthaFilters, SpecialTithiFilters } from "@/types/domain";

const staticQueryOptions = {
  staleTime: Infinity,
  gcTime: 1000 * 60 * 30
} as const;

/** Fetch all available Panchanga locations. */
export const useLocations = () =>
  useQuery({
    queryKey: ["locations"],
    queryFn: () => panchangaRepository.getLocations(),
    ...staticQueryOptions
  });

/** Fetch metadata about the currently bundled seed data. */
export const useDataVersion = () =>
  useQuery({
    queryKey: ["data-version"],
    queryFn: () => panchangaRepository.getDataVersion(),
    ...staticQueryOptions
  });

/** Fetch one location record by id. */
export const useLocation = (locationId: string) =>
  useQuery({
    queryKey: ["location", locationId],
    queryFn: () => panchangaRepository.getLocationById(locationId),
    enabled: Boolean(locationId),
    ...staticQueryOptions
  });

/** Fetch month-summary rows for a given year, month, and location. */
export const useMonthSummary = (year: number, month: number, locationId: string, timezone: string) =>
  useQuery({
    queryKey: ["month-summary", year, month, locationId],
    queryFn: () => panchangaRepository.getMonthSummary(year, month, locationId, getTodayForTimezone(timezone)),
    enabled: Boolean(locationId),
    placeholderData: (previousData) => previousData,
    ...staticQueryOptions
  });

/** Fetch the full detail bundle for one day. */
export const useDayDetails = (date: string, locationId: string) =>
  useQuery({
    queryKey: ["day-details", date, locationId],
    queryFn: () => panchangaRepository.getDayDetails(date, locationId),
    enabled: Boolean(date) && Boolean(locationId),
    ...staticQueryOptions
  });

/** Fetch special tithis for the selected location and filter set. */
export const useSpecialTithis = (locationId: string, filters: SpecialTithiFilters) =>
  useQuery({
    queryKey: ["special-tithis", locationId, filters],
    queryFn: () => panchangaRepository.getSpecialTithisByRange(locationId, filters),
    enabled: Boolean(locationId),
    placeholderData: (previousData) => previousData,
    ...staticQueryOptions
  });

/** Fetch muhurtha entries for the selected location and filter set. */
export const useMuhurthas = (locationId: string, filters: MuhurthaFilters) =>
  useQuery({
    queryKey: ["muhurthas", locationId, filters],
    queryFn: () => panchangaRepository.getMuhurthas(locationId, filters),
    enabled: Boolean(locationId),
    placeholderData: (previousData) => previousData,
    ...staticQueryOptions
  });

/** Run a search query against the local Panchanga database. */
export const useSearch = (query: string, locationId: string) =>
  useQuery({
    queryKey: ["search", locationId, query],
    queryFn: () => searchRepository.search(query, locationId),
    enabled: query.trim().length > 0 && Boolean(locationId)
  });
