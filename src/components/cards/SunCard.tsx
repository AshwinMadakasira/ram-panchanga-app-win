import { StyleSheet, Text, View } from "react-native";

import type { CalendarDay } from "@/types/domain";
import { useAppTheme } from "@/theme";

export const SunCard = ({ day }: { day: CalendarDay }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sun and moon</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Sunrise</Text>
        <Text style={styles.value}>{day.sunrise || "Unavailable"}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Sunset</Text>
        <Text style={styles.value}>{day.sunset || "Unavailable"}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Moonrise</Text>
        <Text style={styles.value}>{day.moonrise || "Unavailable"}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Moonset</Text>
        <Text style={styles.value}>{day.moonset || "Unavailable"}</Text>
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
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
    row: {
      flexDirection: "row",
      justifyContent: "space-between"
    },
    label: {
      color: theme.colors.muted,
      fontFamily: theme.typography.bodyFamily
    },
    value: {
      color: theme.colors.ink,
      fontWeight: "600",
      fontFamily: theme.typography.bodyFamily
    }
  });
