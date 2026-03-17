/*
 * Component teaching note:
 * This component presents intraday details in a compact grid instead of a long vertical list.
 * That tradeoff favors scanability: users can see sun, moon, sacred times, and transitions at once.
 */
import { StyleSheet, Text, View } from "react-native";

// The component receives ready-to-render timeline entries from the screen layer.
import { useAppTheme } from "@/theme";

export type TransitionTimelineEntry = {
  id: string;
  type: string;
  name: string;
  detail: string;
};

/** Render intraday entries in a compact card grid. */
export const TransitionTimeline = ({ items }: { items: TransitionTimelineEntry[] }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View key={item.id} style={styles.item}>
          <Text style={styles.type}>{item.type}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.detail}</Text>
        </View>
      ))}
    </View>
  );
};

/** Build this component's theme-aware styles. */
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.xs
    },
    item: {
      flexBasis: "49%",
      minWidth: 0,
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.sm,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 2
    },
    type: {
      color: theme.colors.saffron,
      fontSize: 12,
      textTransform: "uppercase",
      fontFamily: theme.typography.bodyStrongFamily
    },
    name: {
      color: theme.colors.ink,
      fontSize: 13,
      lineHeight: 18,
      fontFamily: theme.typography.bodyStrongFamily
    },
    time: {
      color: theme.colors.muted,
      marginTop: 2,
      fontSize: 18,
      lineHeight: 22,
      fontFamily: theme.typography.headingFamily
    }
  });
