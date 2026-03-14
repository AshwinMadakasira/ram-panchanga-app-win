import { useQuery } from "@tanstack/react-query";

import { getTodayForTimezone } from "@/domain/dates";
import { panchangaRepository } from "@/db/repositories/panchanga-repository";
import { searchRepository } from "@/db/repositories/search-repository";
import type { MuhurthaFilters, SpecialTithiFilters } from "@/types/domain";

const staticQueryOptions = {
  staleTime: Infinity,
  gcTime: 1000 * 60 * 30
} as const;

export const useLocations = () =>
  useQuery({
    queryKey: ["locations"],
    queryFn: () => panchangaRepository.getLocations(),
    ...staticQueryOptions
  });

export const useDataVersion = () =>
  useQuery({
    queryKey: ["data-version"],
    queryFn: () => panchangaRepository.getDataVersion(),
    ...staticQueryOptions
  });

export const useLocation = (locationId: string) =>
  useQuery({
    queryKey: ["location", locationId],
    queryFn: () => panchangaRepository.getLocationById(locationId),
    enabled: Boolean(locationId),
    ...staticQueryOptions
  });

export const useMonthSummary = (year: number, month: number, locationId: string, timezone: string) =>
  useQuery({
    queryKey: ["month-summary", year, month, locationId],
    queryFn: () => panchangaRepository.getMonthSummary(year, month, locationId, getTodayForTimezone(timezone)),
    enabled: Boolean(locationId),
    placeholderData: (previousData) => previousData,
    ...staticQueryOptions
  });

export const useDayDetails = (date: string, locationId: string) =>
  useQuery({
    queryKey: ["day-details", date, locationId],
    queryFn: () => panchangaRepository.getDayDetails(date, locationId),
    enabled: Boolean(date) && Boolean(locationId),
    ...staticQueryOptions
  });

export const useSpecialTithis = (locationId: string, filters: SpecialTithiFilters) =>
  useQuery({
    queryKey: ["special-tithis", locationId, filters],
    queryFn: () => panchangaRepository.getSpecialTithisByRange(locationId, filters),
    enabled: Boolean(locationId),
    placeholderData: (previousData) => previousData,
    ...staticQueryOptions
  });

export const useMuhurthas = (locationId: string, filters: MuhurthaFilters) =>
  useQuery({
    queryKey: ["muhurthas", locationId, filters],
    queryFn: () => panchangaRepository.getMuhurthas(locationId, filters),
    enabled: Boolean(locationId),
    placeholderData: (previousData) => previousData,
    ...staticQueryOptions
  });

export const useSearch = (query: string, locationId: string) =>
  useQuery({
    queryKey: ["search", locationId, query],
    queryFn: () => searchRepository.search(query, locationId),
    enabled: query.trim().length > 0 && Boolean(locationId)
  });
