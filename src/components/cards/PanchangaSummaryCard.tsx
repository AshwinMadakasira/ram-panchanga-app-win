/*
 * Component teaching note:
 * This card shows the headline Panchanga state "at sunrise".
 * The sunrise-based summary is a product decision: it gives one stable snapshot for the day.
 */
import { StyleSheet, Text, View } from "react-native";

// This card is purely presentational; it receives an already-loaded `CalendarDay` object.
import { useAppLocalization } from "@/i18n";
import type { CalendarDay } from "@/types/domain";
import { useAppTheme } from "@/theme";

type PanchangaSummaryCardProps = {
  day: CalendarDay;
};

/** Render one labeled row inside the summary card. */
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

/** Show the most important sunrise-based Panchanga fields for a day. */
export const PanchangaSummaryCard = ({ day }: PanchangaSummaryCardProps) => {
  const theme = useAppTheme();
  const { dynamic, text } = useAppLocalization();
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{text.summaryAtSunrise}</Text>
      <SummaryRow label={text.tithi} value={dynamic(day.primaryTithiAtSunrise)} styles={styles} />
      <SummaryRow label={text.nakshatra} value={dynamic(day.primaryNakshatraAtSunrise)} styles={styles} />
      <SummaryRow label={text.yoga} value={dynamic(day.primaryYogaAtSunrise)} styles={styles} />
      <SummaryRow label={text.karana} value={dynamic(day.primaryKaranaAtSunrise)} styles={styles} />
      <SummaryRow label={text.lunarMonth} value={dynamic(day.lunarMonth)} styles={styles} />
    </View>
  );
};

/** Build this component's theme-aware styles. */
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
      fontFamily: theme.typography.headingFamily
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: theme.spacing.md
    },
    label: {
      color: theme.colors.muted,
      fontSize: 15,
      flex: 1,
      fontFamily: theme.typography.bodyFamily
    },
    value: {
      color: theme.colors.ink,
      fontSize: 15,
      flex: 1,
      textAlign: "right",
      fontFamily: theme.typography.bodyStrongFamily
    }
  });
