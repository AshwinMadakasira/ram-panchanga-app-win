/*
 * Screen teaching note:
 * Settings screens are often mostly state wiring. This file connects reusable controls to the
 * persisted settings store and to reminder-related business rules.
 *
 * Product choices shown here:
 * - user preferences stay local
 * - reminders are optional
 * - location changes switch which seed dataset is read
 * - theme can follow the system or be overridden
 */
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

// These imports show a common pattern in React apps: UI pieces, domain labels, hooks, services, store, then types.
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { ReminderTimeField } from "@/components/settings/ReminderTimeField";
import { SettingsChipGroup } from "@/components/settings/SettingsChipGroup";
import { getSpecialTithiCategoryLabels } from "@/domain/panchanga/labels";
import { useDataVersion } from "@/hooks/usePanchangaQueries";
import { useSelectedLocation } from "@/hooks/useSelectedLocation";
import { useAppLocalization } from "@/i18n";
import { isValidReminderTime, reminderWeekdayOptions } from "@/services/reminders";
import { useSettingsStore } from "@/store/settings-store";
import { useAppTheme } from "@/theme";
import type { AppLanguage, ReminderWeekday, ThemePreference, UpcomingSpecialTithiCategory } from "@/types/domain";

const themeOptions: ThemePreference[] = ["system", "light", "dark"];
const languageOptions: AppLanguage[] = ["en", "kn"];
const leadDayOptions = [0, 1, 2, 3, 7];
const weekdayLabelMap: Record<ReminderWeekday, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun"
};
const weekdayKannadaLabelMap: Record<ReminderWeekday, string> = {
  monday: "ಸೋಮ",
  tuesday: "ಮಂಗಳ",
  wednesday: "ಬುಧ",
  thursday: "ಗುರು",
  friday: "ಶುಕ್ರ",
  saturday: "ಶನಿ",
  sunday: "ಭಾನು"
};
const specialTithiReminderCategories: UpcomingSpecialTithiCategory[] = ["ekadashi", "pournami", "punyadina"];

/** Use short fixed Kannada weekday labels so all chips fit without per-chip font shrinking. */
const getKannadaWeekdayChipLabel = (weekday: ReminderWeekday) => {
  const fallbackLabel = weekdayKannadaLabelMap[weekday];

  switch (weekday) {
    case "monday":
      return "ಸೋ";
    case "tuesday":
      return "ಮಂ";
    case "wednesday":
      return "ಬು";
    case "thursday":
      return "ಗು";
    case "friday":
      return "ಶು";
    case "saturday":
      return "ಶನಿ";
    case "sunday":
      return "ಭಾ";
    default:
      return fallbackLabel;
  }
};

/** Format advance-notification labels as stacked chip text so they stay readable in one row. */
const getLeadDayLabel = (days: number, language: AppLanguage) => {
  if (language === "kn") {
    return days === 0 ? "ಅದೇ\nದಿನ" : `${days} ದಿನ\nಮೊದಲು`;
  }

  if (days === 0) {
    return "Same\nDay";
  }

  return `${days}\n${days === 1 ? "Day" : "Days"} before`;
};

export default function SettingsScreen() {
  const theme = useAppTheme();
  const { language, text, dynamic } = useAppLocalization();
  const styles = createStyles(theme);
  const appLanguage = useSettingsStore((state) => state.appLanguage);
  const themePreference = useSettingsStore((state) => state.themePreference);
  const reminders = useSettingsStore((state) => state.reminders);
  const setLocationId = useSettingsStore((state) => state.setLocationId);
  const setAppLanguage = useSettingsStore((state) => state.setAppLanguage);
  const setThemePreference = useSettingsStore((state) => state.setThemePreference);
  const setDailyReminderEnabled = useSettingsStore((state) => state.setDailyReminderEnabled);
  const setDailyReminderTime = useSettingsStore((state) => state.setDailyReminderTime);
  const toggleDailyReminderWeekday = useSettingsStore((state) => state.toggleDailyReminderWeekday);
  const setSpecialTithiReminderEnabled = useSettingsStore((state) => state.setSpecialTithiReminderEnabled);
  const setSpecialTithiReminderTime = useSettingsStore((state) => state.setSpecialTithiReminderTime);
  const setSpecialTithiReminderLeadDays = useSettingsStore((state) => state.setSpecialTithiReminderLeadDays);
  const toggleSpecialTithiReminderCategory = useSettingsStore((state) => state.toggleSpecialTithiReminderCategory);
  const { data, isLoading: versionLoading, error: versionError } = useDataVersion();
  const { locations, location, isLoading: locationLoading, error: locationError } = useSelectedLocation();
  const categoryLabels = getSpecialTithiCategoryLabels(language);
  const themeOptionLabels: Record<ThemePreference, string> = {
    system: text.system,
    light: text.light,
    dark: text.dark
  };

  return (
    <ScreenContainer scroll={false} title={text.settings} showSearch>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {locationError || versionError ? (
          <ErrorState message={(locationError ?? versionError)?.message ?? text.unableToLoadSettings} />
        ) : null}

        <View style={styles.card}>
          <Text style={styles.title}>{text.language}</Text>
          <SettingsChipGroup
            onToggle={(value) => setAppLanguage(value as AppLanguage)}
            options={languageOptions.map((option) => ({
              value: option,
              label: option === "en" ? text.english : text.kannada
            }))}
            selectedValues={[appLanguage]}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>{text.dailyNotification}</Text>
          <Text style={styles.body}>{text.dailyNotificationDescription}</Text>
          <View style={styles.inlineRow}>
            <Text style={styles.label}>{text.status}</Text>
            <Pressable
              onPress={() => setDailyReminderEnabled(!reminders.daily.enabled)}
              style={[styles.option, reminders.daily.enabled && styles.optionActive]}
            >
              <Text style={[styles.optionLabel, reminders.daily.enabled && styles.optionLabelActive]}>
                {reminders.daily.enabled ? text.on : text.off}
              </Text>
            </Pressable>
          </View>
          <ReminderTimeField
            helper={text.notificationTimeHelp}
            invalid={!isValidReminderTime(reminders.daily.time)}
            label={text.notificationTime}
            onChangeText={setDailyReminderTime}
            value={reminders.daily.time}
          />
          <Text style={styles.label}>{text.weekdays}</Text>
          <SettingsChipGroup
            onToggle={(value) => toggleDailyReminderWeekday(value as ReminderWeekday)}
            options={reminderWeekdayOptions.map((weekday) => ({
              value: weekday,
              label: language === "kn" ? getKannadaWeekdayChipLabel(weekday) : weekdayLabelMap[weekday]
            }))}
            selectedValues={reminders.daily.weekdays}
            shrinkToFit={false}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>{text.upcomingSpecialTithiNotification}</Text>
          <Text style={styles.body}>{text.upcomingSpecialTithiDescription}</Text>
          <Text style={styles.body}>
            {text.notificationPermission}: {dynamic(reminders.permission) || reminders.permission}
          </Text>
          <View style={styles.inlineRow}>
            <Text style={styles.label}>{text.status}</Text>
            <Pressable
              onPress={() => setSpecialTithiReminderEnabled(!reminders.specialTithi.enabled)}
              style={[styles.option, reminders.specialTithi.enabled && styles.optionActive]}
            >
              <Text style={[styles.optionLabel, reminders.specialTithi.enabled && styles.optionLabelActive]}>
                {reminders.specialTithi.enabled ? text.on : text.off}
              </Text>
            </Pressable>
          </View>
          <Text style={styles.label}>{text.specialTithiTypes}</Text>
          <SettingsChipGroup
            onToggle={(value) => toggleSpecialTithiReminderCategory(value as UpcomingSpecialTithiCategory)}
            options={specialTithiReminderCategories.map((category) => ({
              value: category,
              label: categoryLabels[category]
            }))}
            selectedValues={reminders.specialTithi.categories.filter((category) =>
              specialTithiReminderCategories.includes(category)
            )}
          />
          <ReminderTimeField
            helper={text.advanceNotificationTimeHelp}
            invalid={!isValidReminderTime(reminders.specialTithi.time)}
            label={text.notificationTime}
            onChangeText={setSpecialTithiReminderTime}
            value={reminders.specialTithi.time}
          />
          <Text style={styles.label}>{text.notifyInAdvance}</Text>
          <SettingsChipGroup
            multiline
            onToggle={(value) => setSpecialTithiReminderLeadDays(Number(value))}
            options={leadDayOptions.map((days) => ({
              value: String(days),
              label: getLeadDayLabel(days, language)
            }))}
            selectedValues={[String(reminders.specialTithi.leadDays)]}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>{text.location}</Text>
          {locationLoading ? (
            <LoadingState title={text.loadingLocations} message={text.preparingLocations} />
          ) : (
            <SettingsChipGroup
              onToggle={setLocationId}
              options={locations.map((option) => ({
                value: option.id,
                label: dynamic(option.name) || option.name
              }))}
              selectedValues={location ? [location.id] : []}
            />
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>{text.themePreference}</Text>
          <View style={styles.options}>
            {themeOptions.map((option) => {
              const active = option === themePreference;
              return (
                <Pressable
                  key={option}
                  onPress={() => setThemePreference(option)}
                  style={[styles.option, active && styles.optionActive]}
                >
                  <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>{themeOptionLabels[option]}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>{text.about}</Text>
          <Text style={styles.body}>{text.aboutDescription}</Text>
        </View>

        {versionLoading ? (
          <LoadingState title={text.loadingDataVersion} message={text.readingBundledDataMetadata} />
        ) : data ? (
          <View style={styles.card}>
            <Text style={styles.title}>{text.dataVersion}</Text>
            <Text style={styles.body}>{text.version}: {data.dataVersion}</Text>
            <Text style={styles.body}>{text.importedAt}: {data.importedAt || text.notImportedYet}</Text>
            <Text style={styles.body}>{text.seededAt}: {data.seededAt || text.notSeededYet}</Text>
            <Text style={styles.body}>{text.fingerprint}: {data.sourceFingerprint || text.noSourceFingerprintYet}</Text>
          </View>
        ) : (
          <EmptyState title={text.noVersionInfoYet} message={text.versionInfoAppearsAfterFirstSeed} />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

/** Create theme-aware styles for the settings screen. */
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    content: {
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.xl
    },
    card: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      padding: theme.spacing.md,
      gap: theme.spacing.sm
    },
    title: {
      color: theme.colors.ink,
      fontSize: Math.round(18 * theme.typography.headingScale),
      fontFamily: theme.typography.headingFamily
    },
    label: {
      color: theme.colors.ink,
      fontFamily: theme.typography.bodyStrongFamily,
      fontSize: Math.round(15 * theme.typography.fontScale)
    },
    body: {
      color: theme.colors.ink,
      fontSize: Math.round(16 * theme.typography.fontScale),
      lineHeight: Math.round(22 * theme.typography.fontScale),
      fontFamily: theme.typography.bodyFamily
    },
    options: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      flexWrap: "wrap"
    },
    option: {
      borderColor: theme.colors.border,
      borderRadius: theme.radii.pill,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 10,
      backgroundColor: theme.colors.card
    },
    optionActive: {
      backgroundColor: theme.colors.maroon,
      borderColor: theme.colors.maroon
    },
    optionLabel: {
      color: theme.colors.ink,
      textTransform: "capitalize",
      fontFamily: theme.typography.bodyStrongFamily,
      fontSize: Math.round(15 * theme.typography.fontScale)
    },
    optionLabelActive: {
      color: "#fff7f0"
    },
    inlineRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      gap: theme.spacing.sm
    }
  });
