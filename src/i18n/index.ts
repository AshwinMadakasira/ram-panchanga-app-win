/*
 * Localization note:
 * This file centralizes two different concerns:
 * - static UI copy translated by hand
 * - dynamic Panchanga data localized from a generated Kannada transliteration artifact
 */
import generatedKannadaMap from "../../data/generated/kannada-transliterations.json";

import { formatDisplayDate, getDisplayMonth } from "@/domain/dates";
import { useSettingsStore } from "@/store/settings-store";
import type { AppLanguage } from "@/types/domain";

const kannadaDynamicMap = generatedKannadaMap as Record<string, string>;

const staticText = {
  en: {
    today: "Today",
    calendar: "Calendar",
    specialTithis: "Special Tithis",
    settings: "Settings",
    search: "Search",
    dayDetail: "Day Detail",
    notFound: "Not Found",
    panchanga: "Panchanga",
    preparingPanchanga: "Preparing Panchanga",
    prev: "Prev",
    next: "Next",
    goToCurrentMonth: "Go to current month",
    selectedLocation: "Selected location",
    summaryAtSunrise: "Summary at sunrise",
    tithi: "Tithi",
    nakshatra: "Nakshatra",
    yoga: "Yoga",
    karana: "Karana",
    lunarMonth: "Lunar month",
    unavailable: "Unavailable",
    sunAndMoon: "Sun and moon",
    sun: "Sun",
    moon: "Moon",
    rise: "Rise",
    set: "Set",
    sacredTimes: "Sacred times",
    braahmiKaala: "Braahmi Kaala",
    morningSandhya: "Morning Sandhya",
    eveningSandhya: "Evening Sandhya",
    language: "Language",
    english: "English",
    kannada: "Kannada",
    system: "System",
    light: "Light",
    dark: "Dark",
    on: "On",
    off: "Off",
    status: "Status",
    selectedTime: "Selected time",
    hour: "Hour",
    minute: "Minute",
    date: "Date",
    specialTithi: "Special Tithi",
    unableToLoadSettings: "Unable to load settings.",
    dailyNotification: "Daily reminder",
    dailyNotificationDescription:
      "Send a recurring reminder that says Check Today's panchanga on your selected weekdays.",
    notificationTime: "Reminder time",
    notificationTimeHelp: "Pick the reminder time with the hour, minute, and AM or PM controls.",
    weekdays: "Weekdays",
    upcomingSpecialTithiNotification: "Upcoming special tithi reminder",
    upcomingSpecialTithiDescription:
      "Pick the special tithi types you care about, then send one simpler advance reminder schedule for all of them.",
    notificationPermission: "Notification permission",
    specialTithiTypes: "Special tithi types",
    advanceNotificationTimeHelp: "This time is used when the advance reminder is sent.",
    notifyInAdvance: "Notify in advance",
    sameDay: "Same day",
    location: "Location",
    loadingLocations: "Loading locations",
    preparingLocations: "Preparing available Panchanga locations.",
    themePreference: "Theme preference",
    about: "About",
    aboutDescription:
      "This app bundles separate Panchanga datasets for Vancouver-PST, Chicago-CST, and NewYork-EST, based on Uttaradi Mutt Panchanga source data.",
    loadingDataVersion: "Loading data version",
    readingBundledDataMetadata: "Reading bundled data metadata from the local database.",
    dataVersion: "Data version",
    version: "Version",
    importedAt: "Imported at",
    seededAt: "Seeded at",
    fingerprint: "Fingerprint",
    notImportedYet: "Not imported yet",
    notSeededYet: "Not seeded yet",
    noSourceFingerprintYet: "No source fingerprint yet",
    noVersionInfoYet: "No version info yet",
    versionInfoAppearsAfterFirstSeed: "Data version details appear after the first database seed."
  },
  kn: {
    today: "ಇಂದು",
    calendar: "ಪಂಚಾಂಗ ಕ್ಯಾಲೆಂಡರ್",
    specialTithis: "ವಿಶೇಷ ತಿಥಿಗಳು",
    settings: "ಸೆಟ್ಟಿಂಗ್ಸ್",
    search: "ಹುಡುಕಿ",
    dayDetail: "ದಿನದ ವಿವರ",
    notFound: "ಪುಟ ಲಭ್ಯವಿಲ್ಲ",
    panchanga: "ಪಂಚಾಂಗ",
    preparingPanchanga: "ಪಂಚಾಂಗ ಸಿದ್ಧವಾಗುತ್ತಿದೆ",
    prev: "ಹಿಂದೆ",
    next: "ಮುಂದೆ",
    goToCurrentMonth: "ಈ ತಿಂಗಳಿಗೆ ಹೋಗಿ",
    selectedLocation: "ಆಯ್ದ ಸ್ಥಳ",
    summaryAtSunrise: "ಸೂರ್ಯೋದಯದ ಸಾರಾಂಶ",
    tithi: "ತಿಥಿ",
    nakshatra: "ನಕ್ಷತ್ರ",
    yoga: "ಯೋಗ",
    karana: "ಕರಣ",
    lunarMonth: "ಚಾಂದ್ರ ಮಾಸ",
    unavailable: "ಲಭ್ಯವಿಲ್ಲ",
    sunAndMoon: "ಸೂರ್ಯ ಮತ್ತು ಚಂದ್ರ",
    sun: "ಸೂರ್ಯ",
    moon: "ಚಂದ್ರ",
    rise: "ಉದಯ",
    set: "ಅಸ್ತ",
    sacredTimes: "ಪವಿತ್ರ ಕಾಲಗಳು",
    braahmiKaala: "ಬ್ರಾಹ್ಮೀ ಕಾಲ",
    morningSandhya: "ಪ್ರಾತಃ ಸಂಧ್ಯಾ",
    eveningSandhya: "ಸಾಯಂ ಸಂಧ್ಯಾ",
    language: "ಭಾಷೆ",
    english: "English",
    kannada: "ಕನ್ನಡ",
    system: "ಸಿಸ್ಟಮ್",
    light: "ಬೆಳಕು",
    dark: "ಕತ್ತಲೆ",
    on: "ಆನ್",
    off: "ಆಫ್",
    status: "ಸ್ಥಿತಿ",
    selectedTime: "ಆಯ್ದ ಸಮಯ",
    hour: "ಗಂಟೆ",
    minute: "ನಿಮಿಷ",
    date: "ದಿನಾಂಕ",
    specialTithi: "ವಿಶೇಷ ತಿಥಿ",
    unableToLoadSettings: "ಸೆಟ್ಟಿಂಗ್ಸ್ ಲೋಡ್ ಮಾಡಲು ಆಗಲಿಲ್ಲ.",
    dailyNotification: "ದಿನನಿತ್ಯ ಅಧಿಸೂಚನೆ",
    dailyNotificationDescription:
      "ಆಯ್ದ ವಾರದ ದಿನಗಳಲ್ಲಿ ಇಂದಿನ ಪಂಚಾಂಗವನ್ನು ನೋಡಲು ಪುನರಾವರ್ತಿತ ಅಧಿಸೂಚನೆಯನ್ನು ಕಳುಹಿಸಿ.",
    notificationTime: "ಅಧಿಸೂಚನೆ ಸಮಯ",
    notificationTimeHelp:
      "ಗಂಟೆ, ನಿಮಿಷ ಮತ್ತು AM ಅಥವಾ PM ನಿಯಂತ್ರಣಗಳ ಮೂಲಕ ಅಧಿಸೂಚನೆ ಸಮಯವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.",
    weekdays: "ವಾರದ ದಿನಗಳು",
    upcomingSpecialTithiNotification: "ಮುಂದಿನ ವಿಶೇಷ ತಿಥಿ ಅಧಿಸೂಚನೆ",
    upcomingSpecialTithiDescription:
      "ನೀವು ಬಯಸುವ ವಿಶೇಷ ತಿಥಿಗಳ ವಿಧಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ, ನಂತರ ಅವಕ್ಕೆ ಒಂದು ಸರಳ ಮುಂಚಿತ ಅಧಿಸೂಚನೆ ವೇಳಾಪಟ್ಟಿಯನ್ನು ಬಳಸಿ.",
    notificationPermission: "ಅಧಿಸೂಚನೆ ಅನುಮತಿ",
    specialTithiTypes: "ವಿಶೇಷ ತಿಥಿ ವಿಧಗಳು",
    advanceNotificationTimeHelp:
      "ಮುಂಚಿತ ಅಧಿಸೂಚನೆಯನ್ನು ಕಳುಹಿಸುವಾಗ ಈ ಸಮಯವನ್ನು ಬಳಸಲಾಗುತ್ತದೆ.",
    notifyInAdvance: "ಮುಂಚಿತವಾಗಿ ತಿಳಿಸಿ",
    sameDay: "ಅದೇ ದಿನ",
    location: "ಸ್ಥಳ",
    loadingLocations: "ಸ್ಥಳಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ",
    preparingLocations: "ಲಭ್ಯವಿರುವ ಪಂಚಾಂಗ ಸ್ಥಳಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ.",
    themePreference: "ಥೀಮ್ ಆದ್ಯತೆ",
    about: "ಆಪ್ ಬಗ್ಗೆ",
    aboutDescription:
      "ಈ ಆಪ್ ಉತ್ತರಾದಿ ಮಠ ಪಂಚಾಂಗ ಮೂಲ ದತ್ತಾಂಶದ ಆಧಾರದ ಮೇಲೆ Vancouver-PST, Chicago-CST ಮತ್ತು NewYork-EST ಗಳಿಗೆ ಪ್ರತ್ಯೇಕ ಪಂಚಾಂಗ ಸಂಕಲನಗಳನ್ನು ಒಳಗೊಂಡಿದೆ.",
    loadingDataVersion: "ದತ್ತಾಂಶ ಆವೃತ್ತಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ",
    readingBundledDataMetadata: "ಸ್ಥಳೀಯ ಡೇಟಾಬೇಸ್‌ನಿಂದ ಸಂಗ್ರಹಿತ ದತ್ತಾಂಶ ಮಾಹಿತಿಯನ್ನು ಓದಲಾಗುತ್ತಿದೆ.",
    dataVersion: "ದತ್ತಾಂಶ ಆವೃತ್ತಿ",
    version: "ಆವೃತ್ತಿ",
    importedAt: "ಇಂಪೋರ್ಟ್ ಆದ ಸಮಯ",
    seededAt: "ಸೀಡ್ ಆದ ಸಮಯ",
    fingerprint: "ಫಿಂಗರ್‌ಪ್ರಿಂಟ್",
    notImportedYet: "ಇನ್ನೂ ಇಲ್ಲ",
    notSeededYet: "ಇನ್ನೂ ಇಲ್ಲ",
    noSourceFingerprintYet: "ಇನ್ನೂ ಲಭ್ಯವಿಲ್ಲ",
    noVersionInfoYet: "ಆವೃತ್ತಿ ಮಾಹಿತಿ ಇಲ್ಲ",
    versionInfoAppearsAfterFirstSeed:
      "ಮೊದಲ ಡೇಟಾಬೇಸ್ ಸೀಡ್ ಆದ ನಂತರ ದತ್ತಾಂಶ ಆವೃತ್ತಿ ಮಾಹಿತಿ ಇಲ್ಲಿ ಕಾಣುತ್ತದೆ."
  }
} as const;

const uiBannerByLanguage: Record<AppLanguage, string> = {
  en: "Sri ParaAbhava Nama Samvatsara",
  kn: "ಶ್ರೀ ಪರಾಭವ ನಾಮ ಸಂವತ್ಸರ"
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
  punyadina: "ಪುಣ್ಯದಿನ",
  sankramana: "ಸಂಕ್ರಮಣ",
  festival: "ಹಬ್ಬ",
  vrata: "ವ್ರತ",
  all: "ಎಲ್ಲಾ",
  date: "ದಿನಾಂಕ",
  special_tithi: "ವಿಶೇಷ ತಿಥಿ",
  unknown: "ಅಜ್ಞಾತ",
  granted: "ಅನುಮತಿಸಲಾಗಿದೆ",
  denied: "ನಿರಾಕರಿಸಲಾಗಿದೆ"
};

const localeByLanguage: Record<AppLanguage, string> = {
  en: "en-US",
  kn: "kn-IN"
};

const normalizeDynamicValue = (value: string) =>
  value
    .replace(/Ã¢â‚¬â„¢/g, "â€™")
    .replace(/Ã¢â‚¬â€œ/g, "â€“")
    .replace(/Ã¢â‚¬â€/g, "â€”")
    .replace(/â€™/g, "’")
    .replace(/â€“/g, "–")
    .replace(/â€”/g, "—")
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");

/** Return the static copy bundle for the requested app language. */
export const getStaticText = (language: AppLanguage) => staticText[language];

/** Return the locale used for Intl date formatting in the selected app language. */
export const getLocaleForLanguage = (language: AppLanguage) => localeByLanguage[language];

/** Return the shared top-banner label for the selected app language. */
export const getYearBannerLabel = (language: AppLanguage) => uiBannerByLanguage[language];

/** Localize one dynamic Panchanga string using the generated Kannada artifact when needed. */
export const localizeDynamicText = (value: string | null | undefined, language: AppLanguage) => {
  if (!value) {
    return value ?? null;
  }

  const normalized = normalizeDynamicValue(value);
  if (language === "en") {
    return normalized;
  }

  return kannadaDynamicMap[normalized] ?? dynamicFallbackKannada[normalized] ?? normalized;
};

/** Format a month label using the selected app language. */
export const localizeDisplayMonth = (year: number, month: number, language: AppLanguage) =>
  getDisplayMonth(year, month, getLocaleForLanguage(language));

/** Format a long date label using the selected app language. */
export const localizeDisplayDate = (date: string, language: AppLanguage) =>
  formatDisplayDate(date, getLocaleForLanguage(language));

/** Read the current app language from persisted settings. */
export const useAppLanguage = () => useSettingsStore((state) => state.appLanguage);

/** Shared localization hook used by UI components. */
export const useAppLocalization = () => {
  const language = useAppLanguage();
  const text = getStaticText(language);

  return {
    language,
    locale: getLocaleForLanguage(language),
    text,
    dynamic: (value: string | null | undefined) => localizeDynamicText(value, language)
  };
};
