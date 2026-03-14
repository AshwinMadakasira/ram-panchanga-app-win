import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useMemo } from "react";

import { SearchHeaderButton } from "@/components/common/SearchHeaderButton";
import { useAppTheme } from "@/theme";

export default function TabLayout() {
  const theme = useAppTheme();
  const screenOptions = useMemo(
    () => ({
      tabBarActiveTintColor: theme.colors.maroon,
      tabBarInactiveTintColor: theme.colors.muted,
      tabBarStyle: {
        backgroundColor: theme.colors.card,
        borderTopColor: theme.colors.border
      },
      headerStyle: {
        backgroundColor: theme.colors.ivory
      },
      headerShadowVisible: false,
      headerTintColor: theme.colors.ink,
      headerRight: SearchHeaderButton
    }),
    [theme]
  );

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="sunny-outline" size={size} />
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="calendar-outline" size={size} />
        }}
      />
      <Tabs.Screen
        name="special-tithis"
        options={{
          title: "Special Tithis",
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="flower-outline" size={size} />
        }}
      />
      {/*
      <Tabs.Screen
        name="muhurthas"
        options={{
          title: "Muhurthas",
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="sparkles-outline" size={size} />
        }}
      />
      */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="settings-outline" size={size} />
        }}
      />
    </Tabs>
  );
}
