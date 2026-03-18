/*
 * Service-layer teaching note:
 * Services hold side-effect-heavy business logic that does not belong in screens.
 * This file deals with notification permissions, scheduling, and translating reminder settings
 * into concrete reminder times.
 */
import type * as ExpoNotifications from "expo-notifications";
import { Platform } from "react-native";

// Domain helpers, labels, repositories, and types are imported because reminder scheduling touches many app layers.
import { getTodayForTimezone } from "@/domain/dates";
import { panchangaRepository } from "@/db/repositories/panchanga-repository";
import {
  buildDailyNotificationContent,
  buildSpecialTithiNotificationContent,
  getIsoDateForTimezoneAtMoment
} from "@/services/reminder-copy";
import type {
  AppLanguage,
  CalendarDay,
  Location,
  ReminderPermissionState,
  ReminderSettings,
  ReminderWeekday,
  UpcomingSpecialTithiCategory
} from "@/types/domain";

const ANDROID_CHANNEL_ID = "ram-panchanga-reminders";
const IOS_PENDING_NOTIFICATION_LIMIT = 64;

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

type ReminderNotificationData =
  | {
      kind: "daily";
      date?: string;
    }
  | {
      kind: "special_tithi";
      date: string;
      category: UpcomingSpecialTithiCategory;
    };

/** Check whether a string matches the app's stored `HH:MM` reminder format. */
export const isValidReminderTime = (value: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

/** Parse the stored time string into numeric hour/minute parts. */
const parseReminderTime = (value: string) => {
  if (!isValidReminderTime(value)) {
    return null;
  }

  const [hour, minute] = value.split(":").map(Number);
  return { hour, minute };
};

/** Build the real notification timestamp for an upcoming-special-tithi reminder. */
const createSpecialTithiTriggerDate = (date: string, leadDays: number, time: string) => {
  const parsedTime = parseReminderTime(time);
  if (!parsedTime) {
    return null;
  }

  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day - leadDays, parsedTime.hour, parsedTime.minute, 0, 0);
};

const getChannelId = () => (Platform.OS === "android" ? ANDROID_CHANNEL_ID : undefined);

/** Convert reminder weekdays into JavaScript's `Date#getDay` numbering. */
const reminderWeekdayToJsDay: Record<ReminderWeekday, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
};

/** Build a concrete device-local trigger date for a target calendar day and stored `HH:MM` time. */
const createDailyTriggerDate = (baseDate: Date, time: string) => {
  const parsedTime = parseReminderTime(time);
  if (!parsedTime) {
    return null;
  }

  const triggerDate = new Date(baseDate);
  triggerDate.setHours(parsedTime.hour, parsedTime.minute, 0, 0);
  return triggerDate;
};

type PreparedNotificationRequest = {
  content: ExpoNotifications.NotificationContentInput;
  trigger: ExpoNotifications.DateTriggerInput;
  date: Date;
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const getNotificationsModule = (): typeof ExpoNotifications => require("expo-notifications");

const isPreparedNotificationRequest = (
  request: PreparedNotificationRequest | null
): request is PreparedNotificationRequest => Boolean(request);

/** Create an in-memory lookup so reminder scheduling can reuse one bulk calendar query. */
const createCalendarDayMap = (days: CalendarDay[]) => new Map(days.map((day) => [day.date, day]));

/** Set notification behavior and Android channels before scheduling anything. */
export const configureReminderNotificationsAsync = async () => {
  if (Platform.OS === "web") {
    return;
  }

  const Notifications = getNotificationsModule();

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

/** Ask the operating system whether the app may show reminder notifications. */
export const requestReminderPermissionsAsync = async (): Promise<ReminderPermissionState> => {
  if (Platform.OS === "web") {
    return "denied";
  }

  const Notifications = getNotificationsModule();
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

/** Keep only the device-safe subset of prepared requests where the OS may cap pending notifications. */
const limitPreparedRequestsForPlatform = (requests: PreparedNotificationRequest[]) => {
  if (Platform.OS !== "ios") {
    return requests;
  }

  return [...requests]
    .sort((left, right) => left.date.getTime() - right.date.getTime())
    .slice(0, IOS_PENDING_NOTIFICATION_LIMIT);
};

/** Schedule prepared dated notifications after applying any platform-specific pending-request cap. */
const schedulePreparedRequestsAsync = async (requests: PreparedNotificationRequest[]) => {
  const Notifications = getNotificationsModule();
  const limitedRequests = limitPreparedRequestsForPlatform(requests);

  await Promise.all(
    limitedRequests.map((request) =>
      Notifications.scheduleNotificationAsync({
        content: request.content,
        trigger: request.trigger
      })
    )
  );
};

/** Build dated daily reminder requests for every matching future bundled calendar date. */
const buildDailyReminderRequestsAsync = async (
  location: Location,
  time: string,
  weekdays: ReminderWeekday[],
  language: AppLanguage,
  futureCalendarDays: CalendarDay[],
  futureCalendarDayMap: Map<string, CalendarDay>
) => {
  const Notifications = getNotificationsModule();
  const now = new Date();
  const selectedJsDays = new Set(weekdays.map((weekday) => reminderWeekdayToJsDay[weekday]));
  const requests: (PreparedNotificationRequest | null)[] = await Promise.all(
    futureCalendarDays.map(async (calendarDay) => {
      const calendarDate = calendarDay.date;
      const [year, month, day] = calendarDate.split("-").map(Number);
      const dayInDeviceTime = new Date(year, month - 1, day);

      if (!selectedJsDays.has(dayInDeviceTime.getDay())) {
        return null;
      }

      const triggerDate = createDailyTriggerDate(dayInDeviceTime, time);
      if (!triggerDate || triggerDate <= now) {
        return null;
      }

      const reminderDate = getIsoDateForTimezoneAtMoment(triggerDate, location.timezone);
      const content = buildDailyNotificationContent({
        language,
        location,
        daySummary: futureCalendarDayMap.get(reminderDate) ?? null
      });

      return {
        date: triggerDate,
        content: {
          ...content,
          sound: "default",
          data: {
            kind: "daily",
            date: reminderDate
          } satisfies ReminderNotificationData
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
          channelId: getChannelId()
        } satisfies ExpoNotifications.DateTriggerInput
      } satisfies PreparedNotificationRequest;
    })
  );

  return requests.filter(isPreparedNotificationRequest);
};

/** Build dated advance-reminder requests for all future special-tithi occurrences in the bundled data. */
const buildUpcomingSpecialTithiReminderRequestsAsync = async (
  location: Location,
  category: UpcomingSpecialTithiCategory,
  fromDate: string,
  time: string,
  leadDays: number,
  language: AppLanguage,
  futureCalendarDayMap: Map<string, CalendarDay>
) => {
  const Notifications = getNotificationsModule();
  const specialTithis = await panchangaRepository.getUpcomingSpecialTithis(
    location.id,
    category,
    fromDate
  );
  const now = new Date();

  const requests: (PreparedNotificationRequest | null)[] = await Promise.all(
    specialTithis.map(async (specialTithi) => {
      const triggerDate = createSpecialTithiTriggerDate(specialTithi.date, leadDays, time);
      if (!triggerDate || triggerDate <= now) {
        return null;
      }

      const content = buildSpecialTithiNotificationContent({
        language,
        location,
        name: specialTithi.name,
        category,
        targetDate: specialTithi.date,
        leadDays,
        daySummary: futureCalendarDayMap.get(specialTithi.date) ?? null
      });

      return {
        date: triggerDate,
        content: {
          ...content,
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
        } satisfies ExpoNotifications.DateTriggerInput
      } satisfies PreparedNotificationRequest;
    })
  );

  return requests.filter(isPreparedNotificationRequest);
};

/** Rebuild all scheduled reminders from the current settings and selected location. */
export const syncReminderNotificationsAsync = async (
  reminders: ReminderSettings,
  location: Location,
  language: AppLanguage
) => {
  if (Platform.OS === "web") {
    return;
  }

  const Notifications = getNotificationsModule();
  await configureReminderNotificationsAsync();
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (reminders.permission !== "granted") {
    return;
  }

  const preparedRequests: PreparedNotificationRequest[] = [];
  const today = getTodayForTimezone(location.timezone);
  const futureCalendarDayMap = createCalendarDayMap(
    await panchangaRepository.getFutureCalendarDays(location.id, today)
  );

  if (reminders.daily.enabled && isValidReminderTime(reminders.daily.time)) {
    preparedRequests.push(
      ...(
        await buildDailyReminderRequestsAsync(
          location,
          reminders.daily.time,
          reminders.daily.weekdays,
          language,
          [...futureCalendarDayMap.values()],
          futureCalendarDayMap
        )
      )
    );
  }

  if (reminders.specialTithi.enabled && isValidReminderTime(reminders.specialTithi.time)) {
    const specialRequests = await Promise.all(
      reminders.specialTithi.categories.map((category) =>
        buildUpcomingSpecialTithiReminderRequestsAsync(
          location,
          category,
          today,
          reminders.specialTithi.time,
          reminders.specialTithi.leadDays,
          language,
          futureCalendarDayMap
        )
      )
    );

    preparedRequests.push(...specialRequests.flat());
  }

  await schedulePreparedRequestsAsync(preparedRequests);
};

/** Safely decode custom notification payload data back into app-specific types. */
export const extractReminderNotificationData = (data: unknown): ReminderNotificationData | null => {
  if (!data || typeof data !== "object") {
    return null;
  }

  const candidate = data as Partial<ReminderNotificationData>;
  if (candidate.kind === "daily") {
    return typeof candidate.date === "string" ? { kind: "daily", date: candidate.date } : { kind: "daily" };
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
