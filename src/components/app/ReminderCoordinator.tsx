import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect } from "react";

import { getTodayForTimezone } from "@/domain/dates";
import { useSelectedLocation } from "@/hooks/useSelectedLocation";
import { useSettingsStore } from "@/store/settings-store";
import { dayRoute } from "@/types/navigation";
import { extractReminderNotificationData, requestReminderPermissionsAsync, syncReminderNotificationsAsync } from "@/services/reminders";

export const ReminderCoordinator = () => {
  const router = useRouter();
  const isHydrated = useSettingsStore((state) => state.isHydrated);
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

    syncReminderNotificationsAsync(reminders, location).catch(() => {});
  }, [isHydrated, isLoading, location, reminders]);

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

      router.push(dayRoute(getTodayForTimezone(location?.timezone ?? "America/Los_Angeles")));
    });

    return () => {
      subscription.remove();
    };
  }, [location?.timezone, router]);

  return null;
};
