/*
 * Architecture note for students:
 * This `_layout.tsx` controls the tab navigator for every screen in the `(tabs)` folder.
 * The app keeps the main journeys shallow on purpose: Today, Calendar, Special Tithis, and Settings.
 * Search is a temporary task, so it appears in the header instead of taking a permanent tab slot.
 */
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useMemo } from "react";

// Shared UI and theme helpers from the app codebase.
import { SearchHeaderButton } from "@/components/common/SearchHeaderButton";
import { useAppLocalization } from "@/i18n";
import { useAppTheme } from "@/theme";

export default function TabLayout() {
  const theme = useAppTheme();
  const { text } = useAppLocalization();
  const screenOptions = useMemo(
    () => ({
      tabBarActiveTintColor: theme.colors.maroon,
      tabBarInactiveTintColor: theme.colors.muted,
      tabBarStyle: {
        backgroundColor: theme.colors.card,
        borderTopColor: theme.colors.border
      },
      tabBarLabelStyle: {
        fontFamily: theme.typography.bodyStrongFamily,
        fontSize: Math.round(11 * theme.typography.compactScale)
      },
      headerStyle: {
        backgroundColor: theme.colors.ivory
      },
      headerShadowVisible: false,
      headerTintColor: theme.colors.ink,
      headerTitleStyle: {
        fontFamily: theme.typography.headingFamily,
        fontSize: Math.round(18 * theme.typography.headingScale)
      },
      headerRight: SearchHeaderButton
    }),
    [theme]
  );

  return (
    // Each `Tabs.Screen` registers one route from the folder as a visible tab.
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: text.today,
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="sunny-outline" size={size} />
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: text.calendar,
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="calendar-outline" size={size} />
        }}
      />
      <Tabs.Screen
        name="special-tithis"
        options={{
          title: text.specialTithis,
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="flower-outline" size={size} />
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: text.settings,
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="settings-outline" size={size} />
        }}
      />
      <Tabs.Screen
        name="day/[date]"
        options={{
          href: null,
          title: text.dayDetail
        }}
      />
    </Tabs>
  );
}
