/*
 * Component teaching note:
 * "Hero" components make a screen's main subject feel prominent.
 * Here the subject is the selected date, which helps users stay oriented while scrolling.
 */
import { StyleSheet, Text, View } from "react-native";

// Formatting logic lives in the domain layer rather than inside the JSX.
import { localizeDisplayDate, useAppLocalization } from "@/i18n";
import { useAppTheme } from "@/theme";

type DateHeroProps = {
  date: string;
  subtitle?: string;
};

/** Render the prominent date banner used near the top of date-based screens. */
export const DateHero = ({ date, subtitle }: DateHeroProps) => {
  const theme = useAppTheme();
  const { language, text } = useAppLocalization();
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>{text.panchanga}</Text>
      <Text style={styles.title}>{localizeDisplayDate(date, language)}</Text>
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
      fontSize: Math.round(13 * theme.typography.compactScale),
      letterSpacing: 1.2,
      textTransform: "uppercase",
      fontFamily: theme.typography.bodyStrongFamily
    },
    title: {
      color: theme.colors.ink,
      fontSize: Math.round(30 * theme.typography.headingScale),
      lineHeight: Math.round(38 * theme.typography.headingScale),
      fontFamily: theme.typography.headingFamily
    },
    subtitle: {
      color: theme.colors.muted,
      fontSize: Math.round(16 * theme.typography.fontScale),
      lineHeight: Math.round(22 * theme.typography.fontScale),
      fontFamily: theme.typography.bodyFamily
    }
  });
