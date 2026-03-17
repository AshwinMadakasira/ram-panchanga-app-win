/*
 * Component teaching note:
 * This is a non-visual coordination component. It renders nothing, but it still performs work.
 * Its job is to connect app startup, stored reminder settings, notification permissions,
 * and navigation when a user taps a notification.
 */
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect } from "react";

// This component bridges notifications, settings, selected location, and navigation.
import { getTodayForTimezone } from "@/domain/dates";
import { useSelectedLocation } from "@/hooks/useSelectedLocation";
import { useSettingsStore } from "@/store/settings-store";
import { dayRoute } from "@/types/navigation";
import { extractReminderNotificationData, requestReminderPermissionsAsync, syncReminderNotificationsAsync } from "@/services/reminders";

/** Keep reminder permissions, scheduled notifications, and notification taps in sync with app state. */
export const ReminderCoordinator = () => {
  const router = useRouter();
  const isHydrated = useSettingsStore((state) => state.isHydrated);
  const appLanguage = useSettingsStore((state) => state.appLanguage);
  const reminders = useSettingsStore((state) => state.reminders);
  const setReminderPermission = useSettingsStore((state) => state.setReminderPermission);
  const { location, isLoading } = useSelectedLocation();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    requestReminderPermissionsAsync()
      .then((permission) => {
        setReminderPermission(permission);
      })
      .catch(() => {
        setReminderPermission("denied");
      });
  }, [isHydrated, setReminderPermission]);

  useEffect(() => {
    if (!isHydrated || isLoading || !location) {
      return;
    }

    syncReminderNotificationsAsync(reminders, location, appLanguage).catch(() => {});
  }, [appLanguage, isHydrated, isLoading, location, reminders]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = extractReminderNotificationData(response.notification.request.content.data);
      if (!data) {
        return;
      }

      if (data.kind === "special_tithi") {
        router.push(dayRoute(data.date));
        return;
      }

      router.push(dayRoute(data.date ?? getTodayForTimezone(location?.timezone ?? "America/Los_Angeles")));
    });

    return () => {
      subscription.remove();
    };
  }, [location?.timezone, router]);

  return null;
};
