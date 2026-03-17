/*
 * Type-system teaching note:
 * This file defines the shared vocabulary of the app.
 * Most other files either produce or consume these shapes.
 */
export type ThemePreference = "system" | "light" | "dark";
export type AppLanguage = "en" | "kn";
export type ReminderWeekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type ReminderPermissionState = "unknown" | "granted" | "denied";

export type Location = {
  id: string;
  name: string;
  region: string | null;
  country: string | null;
  timezone: string;
  latitude: number | null;
  longitude: number | null;
};

export type CalendarDay = {
  id: string;
  date: string;
  locationId: string;
  weekday: string;
  gregorianMonth: string;
  gregorianDay: number;
  gregorianYear: number;
  lunarMonth: string;
  adhikaMonthFlag: boolean;
  primaryTithiAtSunrise: string | null;
  primaryNakshatraAtSunrise: string | null;
  primaryYogaAtSunrise: string | null;
  primaryKaranaAtSunrise: string | null;
  sunrise: string | null;
  sunset: string | null;
  moonrise: string | null;
  moonset: string | null;
  specialTithiRawText: string | null;
  sourcePage: number | null;
};

export type DayTransitionType = "tithi" | "nakshatra" | "yoga" | "karana";

export type DayTransition = {
  id: string;
  calendarDayId: string;
  type: DayTransitionType;
  name: string;
  startsAt: string | null;
  endsAt: string | null;
  displayOrder: number;
  rawSourceText: string | null;
};

export type SpecialTithiCategory =
  | "festival"
  | "vrata"
  | "ekadashi"
  | "punyadina"
  | "sankramana"
  | "all";

export type UpcomingSpecialTithiCategory = Exclude<SpecialTithiCategory, "all">;

export type SpecialTithi = {
  id: string;
  calendarDayId: string;
  name: string;
  category: Exclude<SpecialTithiCategory, "all"> | null;
  priority: number;
  description: string | null;
  rawText: string | null;
  date?: string;
};

export type TimeWindow = {
  id: string;
  calendarDayId: string;
  type: string;
  startTime: string | null;
  endTime: string | null;
  notes: string | null;
};

export type MuhurthaType = "vivaha" | "upanayana" | "vastu" | "all";

export type Muhurtha = {
  id: string;
  date: string;
  locationId: string;
  type: Exclude<MuhurthaType, "all"> | string;
  pakshaSection: string | null;
  solarMasa: string | null;
  vara: string | null;
  tithi: string | null;
  nakshatra: string | null;
  yoga: string | null;
  lagna: string | null;
  notes: string | null;
  rawFields: string | null;
};

export type EkadashiVariant = "Sarvathra" | "Bhagavatha" | "Smartha";

export type Ekadashi = {
  id: string;
  calendarDayId: string;
  date: string;
  locationId: string;
  variant: EkadashiVariant;
  name: string | null;
  displayName: string;
  rawText: string;
};

export type Punyadina = {
  id: string;
  calendarDayId: string;
  date: string;
  locationId: string;
  honoree: string;
  details: string | null;
  displayName: string;
  rawText: string;
};

export type DayDetails = {
  day: CalendarDay;
  transitions: DayTransition[];
  specialTithis: SpecialTithi[];
  timeWindows: TimeWindow[];
  muhurthas: Muhurtha[];
};

export type MonthSummaryDay = CalendarDay & {
  specialTithis: Pick<SpecialTithi, "id" | "name" | "category">[];
  isToday: boolean;
};

export type DataVersion = {
  dataVersion: string;
  importedAt: string | null;
  seededAt: string | null;
  sourceFingerprint: string | null;
};

export type SpecialTithiFilters = {
  startDate?: string;
  endDate?: string;
  category?: SpecialTithiCategory;
};

export type MuhurthaFilters = {
  type?: MuhurthaType;
  month?: number;
};

export type SeedBundle = {
  dataVersion: string;
  importedAt: string | null;
  sourceFingerprint: string | null;
  locations: Location[];
  calendarDays: CalendarDay[];
  transitions: DayTransition[];
  specialTithis: SpecialTithi[];
  ekadashis: Ekadashi[];
  punyadinas: Punyadina[];
  timeWindows: TimeWindow[];
  muhurthas: Muhurtha[];
};

export type SearchResult =
  | { id: string; kind: "date"; title: string; subtitle: string; date: string }
  | { id: string; kind: "special_tithi"; title: string; subtitle: string; date: string };

export type DailyReminderSettings = {
  enabled: boolean;
  time: string;
  weekdays: ReminderWeekday[];
};

export type UpcomingSpecialTithiReminderSettings = {
  enabled: boolean;
  time: string;
  leadDays: number;
  categories: UpcomingSpecialTithiCategory[];
};

export type ReminderSettings = {
  daily: DailyReminderSettings;
  specialTithi: UpcomingSpecialTithiReminderSettings;
  permission: ReminderPermissionState;
};
