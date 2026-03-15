import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ReminderTimeField } from "@/components/settings/ReminderTimeField";
import { SettingsChipGroup } from "@/components/settings/SettingsChipGroup";
import { specialTithiCategoryLabels } from "@/domain/panchanga/labels";
import { useDataVersion } from "@/hooks/usePanchangaQueries";
import { useSelectedLocation } from "@/hooks/useSelectedLocation";
import { isValidReminderTime, reminderWeekdayOptions } from "@/services/reminders";
import { useSettingsStore } from "@/store/settings-store";
import { useAppTheme } from "@/theme";
import type { ReminderWeekday, ThemePreference, UpcomingSpecialTithiCategory } from "@/types/domain";

const themeOptions: ThemePreference[] = ["system", "light", "dark"];
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
const specialTithiReminderCategories: UpcomingSpecialTithiCategory[] = [
  "ekadashi",
  "punyadina",
  "sankramana",
  "festival",
  "vrata"
];

export default function SettingsScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const locationId = useSettingsStore((state) => state.locationId);
  const themePreference = useSettingsStore((state) => state.themePreference);
  const reminders = useSettingsStore((state) => state.reminders);
  const setLocationId = useSettingsStore((state) => state.setLocationId);
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

  return (
    <ScreenContainer scroll={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Settings" subtitle="Theme, reminders, location, and bundled data version." />
        {locationError || versionError ? (
          <ErrorState message={(locationError ?? versionError)?.message ?? "Unable to load settings."} />
        ) : null}

        <View style={styles.card}>
          <Text style={styles.title}>Daily reminder</Text>
          <Text style={styles.body}>
            Send a recurring reminder that says Check Today&apos;s panchanga on your selected weekdays.
          </Text>
          <View style={styles.inlineRow}>
            <Text style={styles.body}>Status</Text>
            <Pressable
              onPress={() => setDailyReminderEnabled(!reminders.daily.enabled)}
              style={[styles.option, reminders.daily.enabled && styles.optionActive]}
            >
              <Text style={[styles.optionLabel, reminders.daily.enabled && styles.optionLabelActive]}>
                {reminders.daily.enabled ? "On" : "Off"}
              </Text>
            </Pressable>
          </View>
          <ReminderTimeField
            helper="Pick the reminder time with the hour, minute, and AM or PM controls."
            invalid={!isValidReminderTime(reminders.daily.time)}
            label="Reminder time"
            onChangeText={setDailyReminderTime}
            value={reminders.daily.time}
          />
          <Text style={styles.label}>Weekdays</Text>
          <SettingsChipGroup
            onToggle={(value) => toggleDailyReminderWeekday(value as ReminderWeekday)}
            options={reminderWeekdayOptions.map((weekday) => ({
              value: weekday,
              label: weekdayLabelMap[weekday]
            }))}
            selectedValues={reminders.daily.weekdays}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Upcoming special tithi reminder</Text>
          <Text style={styles.body}>
            Pick the special tithi types you care about, then send one simpler advance reminder schedule for all of them.
          </Text>
          <Text style={styles.body}>Notification permission: {reminders.permission}</Text>
          <View style={styles.inlineRow}>
            <Text style={styles.body}>Status</Text>
            <Pressable
              onPress={() => setSpecialTithiReminderEnabled(!reminders.specialTithi.enabled)}
              style={[styles.option, reminders.specialTithi.enabled && styles.optionActive]}
            >
              <Text style={[styles.optionLabel, reminders.specialTithi.enabled && styles.optionLabelActive]}>
                {reminders.specialTithi.enabled ? "On" : "Off"}
              </Text>
            </Pressable>
          </View>
          <Text style={styles.label}>Special tithi types</Text>
          <SettingsChipGroup
            onToggle={(value) => toggleSpecialTithiReminderCategory(value as UpcomingSpecialTithiCategory)}
            options={specialTithiReminderCategories.map((category) => ({
              value: category,
              label: specialTithiCategoryLabels[category]
            }))}
            selectedValues={reminders.specialTithi.categories}
          />
          <ReminderTimeField
            helper="This time is used when the advance reminder is sent."
            invalid={!isValidReminderTime(reminders.specialTithi.time)}
            label="Reminder time"
            onChangeText={setSpecialTithiReminderTime}
            value={reminders.specialTithi.time}
          />
          <Text style={styles.label}>Notify in advance</Text>
          <SettingsChipGroup
            onToggle={(value) => setSpecialTithiReminderLeadDays(Number(value))}
            options={leadDayOptions.map((days) => ({
              value: String(days),
              label: days === 0 ? "Same day" : `${days}d before`
            }))}
            selectedValues={[String(reminders.specialTithi.leadDays)]}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Location</Text>
          {locationLoading ? (
            <LoadingState title="Loading locations" message="Preparing available Panchanga locations." />
          ) : (
            <>
              <Text style={styles.body}>
                {location ? `${location.name}, ${location.region ?? location.country ?? ""} | ${location.timezone}` : "No location found"}
              </Text>
              <View style={styles.options}>
                {locations.map((option) => {
                  const active = option.id === locationId;
                  return (
                    <Pressable
                      key={option.id}
                      onPress={() => setLocationId(option.id)}
                      style={[styles.option, active && styles.optionActive]}
                    >
                      <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>{option.name}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Theme preference</Text>
          <View style={styles.options}>
            {themeOptions.map((option) => {
              const active = option === themePreference;
              return (
                <Pressable
                  key={option}
                  onPress={() => setThemePreference(option)}
                  style={[styles.option, active && styles.optionActive]}
                >
                  <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>{option}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>About</Text>
          <Text style={styles.body}>
            This app bundles separate Panchanga datasets for Vancouver-PST, Chicago-CST, and NewYork-EST, based on Uttaradi Mutt Panchanga source data.
          </Text>
        </View>

        {versionLoading ? (
          <LoadingState title="Loading data version" message="Reading bundled data metadata from the local database." />
        ) : data ? (
          <View style={styles.card}>
            <Text style={styles.title}>Data version</Text>
            <Text style={styles.body}>Version: {data.dataVersion}</Text>
            <Text style={styles.body}>Imported at: {data.importedAt || "Not imported yet"}</Text>
            <Text style={styles.body}>Seeded at: {data.seededAt || "Not seeded yet"}</Text>
            <Text style={styles.body}>Fingerprint: {data.sourceFingerprint || "No source fingerprint yet"}</Text>
          </View>
        ) : (
          <EmptyState title="No version info yet" message="Data version details appear after the first database seed." />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

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
      fontSize: 18,
      fontWeight: "700",
      fontFamily: theme.typography.headingFamily
    },
    label: {
      color: theme.colors.ink,
      fontWeight: "600",
      fontFamily: theme.typography.bodyFamily
    },
    body: {
      color: theme.colors.muted,
      lineHeight: 22,
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
      fontWeight: "600",
      fontFamily: theme.typography.bodyFamily
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
