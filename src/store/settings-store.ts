/*
 * State-layer teaching note:
 * Zustand stores app-wide user preferences outside the React component tree.
 * This store is persisted to AsyncStorage so settings survive app restarts.
 *
 * It also contains migration logic, which is an important real-world skill:
 * apps often need to read older saved data and reshape it into a newer format.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// The store imports only types, not UI code, because it represents app state rather than presentation.
import type {
  AppLanguage,
  ReminderPermissionState,
  ReminderSettings,
  ReminderWeekday,
  ThemePreference,
  UpcomingSpecialTithiCategory,
  UpcomingSpecialTithiReminderSettings
} from "@/types/domain";

const defaultWeekdays: ReminderWeekday[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const defaultSpecialTithiCategories: UpcomingSpecialTithiCategory[] = ["ekadashi", "punyadina"];
/** Migrate an older location id into the current canonical id. */
const normalizePersistedLocationId = (locationId: string | undefined) => {
  if (!locationId || locationId === "vancouver-bc") {
    return "vancouver-pst";
  }

  return locationId;
};

/** Build the default special-tithi reminder settings. */
const createDefaultSpecialTithiReminder = (): UpcomingSpecialTithiReminderSettings => ({
  enabled: false,
  time: "18:00",
  leadDays: 1,
  categories: defaultSpecialTithiCategories
});

/** Build the full default reminder settings object. */
const createDefaultReminderSettings = (): ReminderSettings => ({
  daily: {
    enabled: false,
    time: "07:00",
    weekdays: defaultWeekdays
  },
  specialTithi: createDefaultSpecialTithiReminder(),
  permission: "unknown"
});

type LegacyReminderSettings = {
  daily?: ReminderSettings["daily"];
  observance?: Partial<UpcomingSpecialTithiReminderSettings>;
  observances?: Partial<Record<UpcomingSpecialTithiCategory, Partial<UpcomingSpecialTithiReminderSettings>>>;
  permission?: ReminderPermissionState;
};

type SettingsState = {
  locationId: string;
  appLanguage: AppLanguage;
  themePreference: ThemePreference;
  reminders: ReminderSettings;
  isHydrated: boolean;
  setLocationId: (locationId: string) => void;
  setAppLanguage: (appLanguage: AppLanguage) => void;
  setThemePreference: (themePreference: ThemePreference) => void;
  setReminderPermission: (permission: ReminderPermissionState) => void;
  setDailyReminderEnabled: (enabled: boolean) => void;
  setDailyReminderTime: (time: string) => void;
  toggleDailyReminderWeekday: (weekday: ReminderWeekday) => void;
  setSpecialTithiReminderEnabled: (enabled: boolean) => void;
  setSpecialTithiReminderTime: (time: string) => void;
  setSpecialTithiReminderLeadDays: (leadDays: number) => void;
  toggleSpecialTithiReminderCategory: (category: UpcomingSpecialTithiCategory) => void;
  setHydrated: (isHydrated: boolean) => void;
};

/** Build the default top-level settings state. */
const createDefaultSettingsState = () => ({
  locationId: "vancouver-pst",
  appLanguage: "en" as AppLanguage,
  themePreference: "system" as ThemePreference,
  reminders: createDefaultReminderSettings()
});

/** Convert older persisted reminder shapes into the current store shape. */
const normalizeLegacyReminders = (legacyReminders?: LegacyReminderSettings): ReminderSettings => {
  const defaults = createDefaultReminderSettings();
  if (!legacyReminders) {
    return defaults;
  }

  if (legacyReminders.observance) {
    return {
      daily: {
        ...defaults.daily,
        ...legacyReminders.daily
      },
      specialTithi: {
        ...defaults.specialTithi,
        ...legacyReminders.observance,
        categories:
          legacyReminders.observance.categories && legacyReminders.observance.categories.length > 0
            ? legacyReminders.observance.categories
            : defaults.specialTithi.categories
      },
      permission: legacyReminders.permission ?? defaults.permission
    };
  }

  const enabledCategories = Object.entries(legacyReminders.observances ?? {})
    .filter(([, settings]) => Boolean(settings?.enabled))
    .map(([category]) => category as UpcomingSpecialTithiCategory);
  const firstConfiguredReminder = Object.values(legacyReminders.observances ?? {}).find(Boolean);

  return {
    daily: {
      ...defaults.daily,
      ...legacyReminders.daily
    },
    specialTithi: {
      ...defaults.specialTithi,
      ...firstConfiguredReminder,
      categories: enabledCategories.length > 0 ? enabledCategories : defaults.specialTithi.categories
    },
    permission: legacyReminders.permission ?? defaults.permission
  };
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...createDefaultSettingsState(),
      isHydrated: false,
      setLocationId: (locationId) => set({ locationId }),
      setAppLanguage: (appLanguage) => set({ appLanguage }),
      setThemePreference: (themePreference) => set({ themePreference }),
      setReminderPermission: (permission) =>
        set((state) => ({
          reminders: {
            ...state.reminders,
            permission
          }
        })),
      setDailyReminderEnabled: (enabled) =>
        set((state) => ({
          reminders: {
            ...state.reminders,
            daily: {
              ...state.reminders.daily,
              enabled
            }
          }
        })),
      setDailyReminderTime: (time) =>
        set((state) => ({
          reminders: {
            ...state.reminders,
            daily: {
              ...state.reminders.daily,
              time
            }
          }
        })),
      toggleDailyReminderWeekday: (weekday) =>
        set((state) => {
          const hasWeekday = state.reminders.daily.weekdays.includes(weekday);
          return {
            reminders: {
              ...state.reminders,
              daily: {
                ...state.reminders.daily,
                weekdays: hasWeekday
                  ? state.reminders.daily.weekdays.filter((entry) => entry !== weekday)
                  : [...state.reminders.daily.weekdays, weekday]
              }
            }
          };
        }),
      setSpecialTithiReminderEnabled: (enabled) =>
        set((state) => ({
          reminders: {
            ...state.reminders,
            specialTithi: {
              ...state.reminders.specialTithi,
              enabled
            }
          }
        })),
      setSpecialTithiReminderTime: (time) =>
        set((state) => ({
          reminders: {
            ...state.reminders,
            specialTithi: {
              ...state.reminders.specialTithi,
              time
            }
          }
        })),
      setSpecialTithiReminderLeadDays: (leadDays) =>
        set((state) => ({
          reminders: {
            ...state.reminders,
            specialTithi: {
              ...state.reminders.specialTithi,
              leadDays
            }
          }
        })),
      toggleSpecialTithiReminderCategory: (category) =>
        set((state) => {
          const hasCategory = state.reminders.specialTithi.categories.includes(category);
          return {
            reminders: {
              ...state.reminders,
              specialTithi: {
                ...state.reminders.specialTithi,
                categories: hasCategory
                  ? state.reminders.specialTithi.categories.filter((entry) => entry !== category)
                  : [...state.reminders.specialTithi.categories, category]
              }
            }
          };
        }),
      setHydrated: (isHydrated) => set({ isHydrated })
    }),
    {
      name: "panchanga-settings",
      storage: createJSONStorage(() => AsyncStorage),
      merge: (persistedState, currentState) => {
        const typedPersistedState = persistedState as Partial<SettingsState> | undefined;
        const defaultReminders = createDefaultReminderSettings();
        const migratedReminders =
          typedPersistedState?.reminders && "specialTithi" in typedPersistedState.reminders
            ? ({
                ...defaultReminders,
                ...typedPersistedState.reminders,
                daily: {
                  ...defaultReminders.daily,
                  ...typedPersistedState.reminders.daily
                },
                specialTithi: {
                  ...defaultReminders.specialTithi,
                  ...typedPersistedState.reminders.specialTithi
                }
              } satisfies ReminderSettings)
            : normalizeLegacyReminders(typedPersistedState?.reminders as LegacyReminderSettings | undefined);

        return {
          ...currentState,
          ...typedPersistedState,
          locationId: normalizePersistedLocationId(typedPersistedState?.locationId),
          reminders: migratedReminders
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      }
    }
  )
);
