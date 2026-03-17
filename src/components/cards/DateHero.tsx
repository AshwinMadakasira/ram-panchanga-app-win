/*
 * Component teaching note:
 * "Hero" components make a screen's main subject feel prominent.
 * Here the subject is the selected date, which helps users stay oriented while scrolling.
 */
import { StyleSheet, Text, View } from "react-native";

// Formatting logic lives in the domain layer rather than inside the JSX.
import { formatDisplayDate } from "@/domain/dates";
import { useAppTheme } from "@/theme";

type DateHeroProps = {
  date: string;
  subtitle?: string;
};

/** Render the prominent date banner used near the top of date-based screens. */
export const DateHero = ({ date, subtitle }: DateHeroProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>Panchanga</Text>
      <Text style={styles.title}>{formatDisplayDate(date)}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

/** Build this component's theme-aware styles. */
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      marginTop: theme.spacing.md,
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      padding: theme.spacing.lg,
      gap: theme.spacing.xs
    },
    kicker: {
      color: theme.colors.saffron,
      fontSize: 13,
      fontWeight: "700",
      letterSpacing: 1.2,
      textTransform: "uppercase",
      fontFamily: theme.typography.bodyFamily
    },
    title: {
      color: theme.colors.ink,
      fontSize: 30,
      fontWeight: "700",
      lineHeight: 38,
      fontFamily: theme.typography.headingFamily
    },
    subtitle: {
      color: theme.colors.muted,
      fontSize: 15,
      lineHeight: 22,
      fontFamily: theme.typography.bodyFamily
    }
  });
