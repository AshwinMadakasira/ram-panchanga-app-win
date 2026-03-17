/*
 * Component teaching note:
 * This card is a formatter for one muhurtha record.
 * It demonstrates a common UI pattern: render the fields that exist and quietly skip optional ones.
 */
import { StyleSheet, Text, View } from "react-native";

// The card depends only on a typed data object and the shared theme.
import type { Muhurtha } from "@/types/domain";
import { useAppTheme } from "@/theme";

/** Render one muhurtha entry as a compact detail card. */
export const MuhurthaCard = ({ muhurtha }: { muhurtha: Muhurtha }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{muhurtha.type}</Text>
      <Text style={styles.date}>{muhurtha.date}</Text>
      <Text style={styles.meta}>
        {[muhurtha.tithi, muhurtha.nakshatra, muhurtha.yoga].filter(Boolean).join(" • ") || "Details unavailable"}
      </Text>
      {muhurtha.lagna ? <Text style={styles.meta}>Lagna: {muhurtha.lagna}</Text> : null}
      {muhurtha.notes ? <Text style={styles.notes}>{muhurtha.notes}</Text> : null}
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
      gap: 4
    },
    title: {
      color: theme.colors.ink,
      fontSize: 17,
      fontWeight: "700",
      textTransform: "capitalize",
      fontFamily: theme.typography.headingFamily
    },
    date: {
      color: theme.colors.saffron,
      fontWeight: "700",
      fontFamily: theme.typography.bodyFamily
    },
    meta: {
      color: theme.colors.muted,
      lineHeight: 20,
      fontFamily: theme.typography.bodyFamily
    },
    notes: {
      color: theme.colors.ink,
      fontFamily: theme.typography.bodyFamily
    }
  });
