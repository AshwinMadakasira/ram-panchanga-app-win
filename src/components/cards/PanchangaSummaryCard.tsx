import { StyleSheet, Text, View } from "react-native";

import type { CalendarDay } from "@/types/domain";
import { useAppTheme } from "@/theme";

type PanchangaSummaryCardProps = {
  day: CalendarDay;
};

const SummaryRow = ({
  label,
  value,
  styles
}: {
  label: string;
  value: string | null;
  styles: ReturnType<typeof createStyles>;
}) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || "Unavailable"}</Text>
  </View>
);

export const PanchangaSummaryCard = ({ day }: PanchangaSummaryCardProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Summary at sunrise</Text>
      <SummaryRow label="Tithi" value={day.primaryTithiAtSunrise} styles={styles} />
      <SummaryRow label="Nakshatra" value={day.primaryNakshatraAtSunrise} styles={styles} />
      <SummaryRow label="Yoga" value={day.primaryYogaAtSunrise} styles={styles} />
      <SummaryRow label="Karana" value={day.primaryKaranaAtSunrise} styles={styles} />
      <SummaryRow label="Lunar month" value={day.lunarMonth} styles={styles} />
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
      justifyContent: "space-between",
      gap: theme.spacing.md
    },
    label: {
      color: theme.colors.muted,
      fontSize: 14,
      flex: 1,
      fontFamily: theme.typography.bodyFamily
    },
    value: {
      color: theme.colors.ink,
      fontSize: 14,
      fontWeight: "600",
      flex: 1,
      textAlign: "right",
      fontFamily: theme.typography.bodyFamily
    }
  });
