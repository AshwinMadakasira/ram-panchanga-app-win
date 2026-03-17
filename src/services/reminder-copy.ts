/*
 * Reminder-copy note:
 * Notification text should be genuinely useful at a glance, but it must also degrade safely.
 * This file stays pure so tests can exercise reminder copy without Expo native modules.
 */
import generatedKannadaMap from "../../data/generated/kannada-transliterations.json";

import type { AppLanguage, CalendarDay, Location, UpcomingSpecialTithiCategory } from "../types/domain";

const kannadaDynamicMap = generatedKannadaMap as Record<string, string>;
const MAX_NOTIFICATION_TITLE_LENGTH = 64;
const MAX_NOTIFICATION_BODY_LENGTH = 180;

const localeByLanguage: Record<AppLanguage, string> = {
  en: "en-US",
  kn: "kn-IN"
};

const staticLabels: Record<
  AppLanguage,
  {
    tithi: string;
    nakshatra: string;
    yoga: string;
  }
> = {
  en: {
    tithi: "Tithi",
    nakshatra: "Nakshatra",
    yoga: "Yoga"
  },
  kn: {
    tithi: "ತಿಥಿ",
    nakshatra: "ನಕ್ಷತ್ರ",
    yoga: "ಯೋಗ"
  }
};

const specialTithiCategoryLabels: Record<AppLanguage, Record<UpcomingSpecialTithiCategory, string>> = {
  en: {
    festival: "Festival",
    vrata: "Vrata",
    ekadashi: "Ekadashi",
    pournami: "Pournami",
    punyadina: "Punyadina",
    sankramana: "Sankramana"
  },
  kn: {
    festival: "ಹಬ್ಬ",
    vrata: "ವ್ರತ",
    ekadashi: "ಏಕಾದಶಿ",
    pournami: "ಪೌರ್ಣಮಿ",
    punyadina: "ಪುಣ್ಯದಿನ",
    sankramana: "ಸಂಕ್ರಮಣ"
  }
};

const notificationText: Record<
  AppLanguage,
  {
    dailyTitle: string;
    sunrise: string;
    sunset: string;
    today: string;
    tomorrow: string;
    inDays: (days: number) => string;
  }
> = {
  en: {
    dailyTitle: "Today's Panchanga",
    sunrise: "Sunrise",
    sunset: "Sunset",
    today: "Today",
    tomorrow: "Tomorrow",
    inDays: (days: number) => `In ${days} days`
  },
  kn: {
    dailyTitle: "ಇಂದಿನ ಪಂಚಾಂಗ",
    sunrise: "ಸೂರ್ಯೋದಯ",
    sunset: "ಸೂರ್ಯಾಸ್ತ",
    today: "ಇಂದು",
    tomorrow: "ನಾಳೆ",
    inDays: (days: number) => `${days} ದಿನಗಳಲ್ಲಿ`
  }
};

const dynamicFallbackKannada: Record<string, string> = {
  "braahmi-kaala": "ಬ್ರಾಹ್ಮೀ ಕಾಲ",
  "morning-sandhya": "ಪ್ರಾತಃ ಸಂಧ್ಯಾ",
  "evening-sandhya": "ಸಾಯಂ ಸಂಧ್ಯಾ",
  vaidhruthi: "ವೈಧೃತಿ",
  tithi: "ತಿಥಿ",
  nakshatra: "ನಕ್ಷತ್ರ",
  yoga: "ಯೋಗ",
  karana: "ಕರಣ",
  ekadashi: "ಏಕಾದಶಿ",
  pournami: "ಪೌರ್ಣಮಿ",
  punyadina: "ಪುಣ್ಯದಿನ",
  sankramana: "ಸಂಕ್ರಮಣ",
  festival: "ಹಬ್ಬ",
  vrata: "ವ್ರತ"
};

/** Normalize common encoding noise before looking dynamic values up in the transliteration map. */
const normalizeDynamicValue = (value: string) =>
  value
    .replace(/ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢/g, "Ã¢â‚¬â„¢")
    .replace(/ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“/g, "Ã¢â‚¬â€œ")
    .replace(/ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â/g, "Ã¢â‚¬â€")
    .replace(/Ã¢â‚¬â„¢/g, "’")
    .replace(/Ã¢â‚¬â€œ/g, "–")
    .replace(/Ã¢â‚¬â€/g, "—")
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");

/** Remove empty placeholder values so notifications never show "null" or broken gaps. */
const cleanValue = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }

  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized || normalized.toLowerCase() === "null") {
    return null;
  }

  return normalized;
};

/** Keep mobile notification strings within a predictable readable length. */
const truncateText = (value: string, limit: number) => {
  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, Math.max(0, limit - 3)).trimEnd()}...`;
};

/** Join content fragments without leaving empty separators behind. */
const joinSegments = (segments: (string | null | undefined)[]) =>
  segments
    .map(cleanValue)
    .filter((segment): segment is string => Boolean(segment))
    .join(" | ");

/** Build a labeled fragment such as "Tithi: Ekadashi". */
const buildLabeledSegment = (label: string, value: string | null | undefined) => {
  const cleanedValue = cleanValue(value);
  if (!cleanedValue) {
    return null;
  }

  return `${label}: ${cleanedValue}`;
};

/** Format a short date label for notification bodies. */
const formatNotificationDate = (date: string, language: AppLanguage) =>
  new Intl.DateTimeFormat(localeByLanguage[language], {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${date}T00:00:00Z`));

/** Localize one dynamic Panchanga field without depending on the React-facing i18n module. */
const localizeDynamicText = (value: string | null | undefined, language: AppLanguage) => {
  if (!value) {
    return value ?? null;
  }

  const normalized = normalizeDynamicValue(value);
  if (language === "en") {
    return normalized;
  }

  return kannadaDynamicMap[normalized] ?? dynamicFallbackKannada[normalized] ?? normalized;
};

/** Format the lead-time phrase for upcoming-special-tithi notifications. */
const formatRelativeLeadPhrase = (language: AppLanguage, leadDays: number) => {
  const copy = notificationText[language];

  if (leadDays <= 0) {
    return copy.today;
  }

  if (leadDays === 1) {
    return copy.tomorrow;
  }

  return copy.inDays(leadDays);
};

/** Convert a future trigger instant into the selected-location calendar date. */
export const getIsoDateForTimezoneAtMoment = (moment: Date, timezone: string) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(moment);

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
};

/** Generate daily reminder copy from the actual Panchanga summary for that target day. */
export const buildDailyNotificationContent = ({
  language,
  location,
  daySummary
}: {
  language: AppLanguage;
  location: Location;
  daySummary: CalendarDay | null;
}) => {
  const text = staticLabels[language];
  const copy = notificationText[language];
  const day = daySummary;
  const detailSegments = [
    buildLabeledSegment(text.tithi, localizeDynamicText(day?.primaryTithiAtSunrise, language)),
    buildLabeledSegment(text.nakshatra, localizeDynamicText(day?.primaryNakshatraAtSunrise, language)),
    buildLabeledSegment(text.yoga, localizeDynamicText(day?.primaryYogaAtSunrise, language)),
    buildLabeledSegment(copy.sunrise, day?.sunrise),
    buildLabeledSegment(copy.sunset, day?.sunset)
  ].filter(Boolean);

  const body = truncateText(joinSegments([location.name, ...detailSegments]), MAX_NOTIFICATION_BODY_LENGTH);

  return {
    title: truncateText(copy.dailyTitle, MAX_NOTIFICATION_TITLE_LENGTH),
    body: body || location.name
  };
};

/** Generate upcoming-special-tithi reminder copy using the event plus day-level Panchanga context. */
export const buildSpecialTithiNotificationContent = ({
  language,
  location,
  name,
  category,
  targetDate,
  leadDays,
  daySummary
}: {
  language: AppLanguage;
  location: Location;
  name: string | null | undefined;
  category: UpcomingSpecialTithiCategory;
  targetDate: string;
  leadDays: number;
  daySummary: CalendarDay | null;
}) => {
  const text = staticLabels[language];
  const day = daySummary;
  const localizedTitle =
    localizeDynamicText(name, language) ??
    localizeDynamicText(specialTithiCategoryLabels[language][category], language) ??
    specialTithiCategoryLabels[language][category];

  const body = truncateText(
    joinSegments([
      formatRelativeLeadPhrase(language, leadDays),
      location.name,
      formatNotificationDate(targetDate, language),
      buildLabeledSegment(text.tithi, localizeDynamicText(day?.primaryTithiAtSunrise, language)),
      buildLabeledSegment(text.nakshatra, localizeDynamicText(day?.primaryNakshatraAtSunrise, language)),
      buildLabeledSegment(notificationText[language].sunrise, day?.sunrise)
    ]),
    MAX_NOTIFICATION_BODY_LENGTH
  );

  return {
    title: truncateText(localizedTitle, MAX_NOTIFICATION_TITLE_LENGTH),
    body: body || truncateText(joinSegments([location.name, formatNotificationDate(targetDate, language)]), MAX_NOTIFICATION_BODY_LENGTH)
  };
};
