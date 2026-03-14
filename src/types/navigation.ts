import type { Href } from "expo-router";

export const dayRoute = (date: string): Href => ({
  pathname: "/day/[date]",
  params: { date }
});

export const searchRoute: Href = "/search";
