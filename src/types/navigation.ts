/*
 * Teaching note:
 * Route helpers centralize navigation shapes so screens do not build URLs by hand.
 */
import type { Href } from "expo-router";

/** Build the typed route object for a day-detail screen. */
export const dayRoute = (date: string): Href => ({
  pathname: "/(tabs)/day/[date]",
  params: { date }
});

/** Typed constant for the search route. */
export const searchRoute: Href = "/search";
