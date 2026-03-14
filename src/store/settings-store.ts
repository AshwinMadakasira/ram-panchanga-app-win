import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  ReminderPermissionState,
  ReminderSettings,
  ReminderWeekday,
  ThemePreference,
  UpcomingSpecialTithiCategory,
  UpcomingSpecialTithiReminderSettings
} from "@/types/domain";

const defaultWeekdays: ReminderWeekday[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const defaultSpecialTithiCategories: UpcomingSpecialTithiCategory[] = ["ekadashi", "punyadina"];

const createDefaultSpecialTithiReminder = (): UpcomingSpecialTithiReminderSettings => ({
  enabled: false,
  time: "18:00",
  leadDays: 1,
  categories: defaultSpecialTithiCategories
});

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
  themePreference: ThemePreference;
  reminders: ReminderSettings;
  isHydrated: boolean;
  setLocationId: (locationId: string) => void;
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

const createDefaultSettingsState = () => ({
  locationId: "vancouver-bc",
  themePreference: "system" as ThemePreference,
  reminders: createDefaultReminderSettings()
});

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
          reminders: migratedReminders
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      }
    }
  )
);
