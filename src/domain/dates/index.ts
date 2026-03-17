/*
 * Domain-layer teaching note:
 * Domain code stores reusable project rules without any React or database code.
 * This file handles calendar math, date formatting, and timezone-aware "today" logic.
 */
/** Convert a JavaScript `Date` into a simple `YYYY-MM-DD` string. */
export const toIsoDate = (input: Date) => input.toISOString().slice(0, 10);

/** Return the first and last ISO date for a given month. */
export const getMonthBounds = (year: number, month: number) => {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0));
  return {
    start: toIsoDate(start),
    end: toIsoDate(end)
  };
};

/** Move forward or backward by whole months and return the resulting year/month pair. */
export const addMonths = (year: number, month: number, delta: number) => {
  const date = new Date(Date.UTC(year, month - 1 + delta, 1));
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1
  };
};

/** Build a Monday-first calendar grid from a flat list of day objects. */
export const getCalendarWeeks = <T extends { date: string }>(year: number, month: number, items: T[]) => {
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const startOffset = (firstDay.getUTCDay() + 6) % 7;
  const itemMap = new Map(items.map((item) => [item.date, item]));
  const cells: (T | null)[] = [];

  for (let index = 0; index < startOffset; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const iso = new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10);
    cells.push(itemMap.get(iso) ?? null);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const weeks: (T | null)[][] = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }

  return weeks;
};

/** Format a month label such as "March 2026". */
export const getDisplayMonth = (year: number, month: number) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(Date.UTC(year, month - 1, 1)));

/** Format a full ISO date into a long human-readable label. */
export const formatDisplayDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${date}T00:00:00Z`));

/** Return today's ISO date according to a specific timezone. */
export const getTodayForTimezone = (timezone: string) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
};

/** Return the current year and month according to a specific timezone. */
export const getCurrentYearMonthForTimezone = (timezone: string, now = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit"
  }).formatToParts(now);

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return {
    year: Number(get("year")),
    month: Number(get("month"))
  };
};
