import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { getTodayForTimezone } from "@/domain/dates";
import { specialTithiCategoryLabels } from "@/domain/panchanga/labels";
import { panchangaRepository } from "@/db/repositories/panchanga-repository";
import type {
  Location,
  ReminderPermissionState,
  ReminderSettings,
  ReminderWeekday,
  UpcomingSpecialTithiCategory
} from "@/types/domain";

const ANDROID_CHANNEL_ID = "ram-panchanga-reminders";
const UPCOMING_SPECIAL_TITHI_LIMIT = 10;

let notificationsConfigured = false;

export const reminderWeekdayOptions: ReminderWeekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday"
];

const reminderWeekdayToTrigger: Record<ReminderWeekday, number> = {
  sunday: 1,
  monday: 2,
  tuesday: 3,
  wednesday: 4,
  thursday: 5,
  friday: 6,
  saturday: 7
};

type ReminderNotificationData =
  | {
      kind: "daily";
    }
  | {
      kind: "special_tithi";
      date: string;
      category: UpcomingSpecialTithiCategory;
    };

export const isValidReminderTime = (value: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

const parseReminderTime = (value: string) => {
  if (!isValidReminderTime(value)) {
    return null;
  }

  const [hour, minute] = value.split(":").map(Number);
  return { hour, minute };
};

const createSpecialTithiTriggerDate = (date: string, leadDays: number, time: string) => {
  const parsedTime = parseReminderTime(time);
  if (!parsedTime) {
    return null;
  }

  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day - leadDays, parsedTime.hour, parsedTime.minute, 0, 0);
};

const formatSpecialTithiDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${date}T00:00:00Z`));

const buildSpecialTithiBody = (category: UpcomingSpecialTithiCategory, date: string) =>
  `Next ${specialTithiCategoryLabels[category]} special tithi is on ${formatSpecialTithiDate(date)}.`;

const getChannelId = () => (Platform.OS === "android" ? ANDROID_CHANNEL_ID : undefined);

export const configureReminderNotificationsAsync = async () => {
  if (!notificationsConfigured) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false
      })
    });
    notificationsConfigured = true;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: "RAM Panchanga Reminders",
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: "default"
    });
  }
};

export const requestReminderPermissionsAsync = async (): Promise<ReminderPermissionState> => {
  await configureReminderNotificationsAsync();
  const current = await Notifications.getPermissionsAsync();

  if (current.granted) {
    return "granted";
  }

  const requested = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true
    }
  });

  return requested.granted ? "granted" : "denied";
};

const scheduleWeeklyReminderAsync = async (weekday: ReminderWeekday, time: string) => {
  const parsedTime = parseReminderTime(time);
  if (!parsedTime) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "RAM Panchanga",
      body: "Check Today's panchanga.",
      sound: "default",
      data: {
        kind: "daily"
      } satisfies ReminderNotificationData
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: reminderWeekdayToTrigger[weekday],
      hour: parsedTime.hour,
      minute: parsedTime.minute,
      channelId: getChannelId()
    }
  });
};

const scheduleUpcomingSpecialTithiRemindersAsync = async (
  locationId: string,
  category: UpcomingSpecialTithiCategory,
  fromDate: string,
  time: string,
  leadDays: number
) => {
  const specialTithis = await panchangaRepository.getUpcomingSpecialTithis(
    locationId,
    category,
    fromDate,
    UPCOMING_SPECIAL_TITHI_LIMIT
  );
  const now = new Date();

  await Promise.all(
    specialTithis.map(async (specialTithi) => {
      const triggerDate = createSpecialTithiTriggerDate(specialTithi.date, leadDays, time);
      if (!triggerDate || triggerDate <= now) {
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "RAM Panchanga",
          body: buildSpecialTithiBody(category, specialTithi.date),
          sound: "default",
          data: {
            kind: "special_tithi",
            date: specialTithi.date,
            category
          } satisfies ReminderNotificationData
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
          channelId: getChannelId()
        }
      });
    })
  );
};

export const syncReminderNotificationsAsync = async (reminders: ReminderSettings, location: Location) => {
  await configureReminderNotificationsAsync();
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (reminders.permission !== "granted") {
    return;
  }

  if (reminders.daily.enabled && isValidReminderTime(reminders.daily.time)) {
    await Promise.all(reminders.daily.weekdays.map((weekday) => scheduleWeeklyReminderAsync(weekday, reminders.daily.time)));
  }

  const today = getTodayForTimezone(location.timezone);
  if (!reminders.specialTithi.enabled || !isValidReminderTime(reminders.specialTithi.time)) {
    return;
  }

  await Promise.all(
    reminders.specialTithi.categories.map((category) =>
      scheduleUpcomingSpecialTithiRemindersAsync(
        location.id,
        category,
        today,
        reminders.specialTithi.time,
        reminders.specialTithi.leadDays
      )
    )
  );
};

export const extractReminderNotificationData = (data: unknown): ReminderNotificationData | null => {
  if (!data || typeof data !== "object") {
    return null;
  }

  const candidate = data as Partial<ReminderNotificationData>;
  if (candidate.kind === "daily") {
    return { kind: "daily" };
  }

  if (
    candidate.kind === "special_tithi" &&
    typeof candidate.date === "string" &&
    typeof candidate.category === "string"
  ) {
    return {
      kind: "special_tithi",
      date: candidate.date,
      category: candidate.category as UpcomingSpecialTithiCategory
    };
  }

  return null;
};
