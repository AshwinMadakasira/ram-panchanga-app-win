import { StyleSheet, Text, View } from "react-native";

import type { DayTransition } from "@/types/domain";
import { useAppTheme } from "@/theme";

export const TransitionTimeline = ({ transitions }: { transitions: DayTransition[] }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const getTimeLabel = (transition: DayTransition) => {
    if (transition.startsAt && transition.endsAt) {
      return `${transition.startsAt} to ${transition.endsAt}`;
    }

    if (transition.endsAt) {
      return `Until ${transition.endsAt}`;
    }

    if (transition.startsAt) {
      return `From ${transition.startsAt}`;
    }

    return "Time not listed";
  };

  return (
    <View style={styles.container}>
      {transitions.map((transition) => (
        <View key={transition.id} style={styles.item}>
          <View style={styles.dot} />
          <View style={styles.content}>
            <Text style={styles.type}>{transition.type}</Text>
            <Text style={styles.name}>{transition.name}</Text>
            <Text style={styles.time}>{getTimeLabel(transition)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.sm
    },
    item: {
      flexDirection: "row",
      gap: theme.spacing.sm
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.saffron,
      marginTop: 8
    },
    content: {
      flex: 1,
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      padding: theme.spacing.md,
      gap: 2
    },
    type: {
      color: theme.colors.saffron,
      fontSize: 12,
      fontWeight: "700",
      textTransform: "uppercase",
      fontFamily: theme.typography.bodyFamily
    },
    name: {
      color: theme.colors.ink,
      fontSize: 16,
      fontWeight: "700",
      fontFamily: theme.typography.headingFamily
    },
    time: {
      color: theme.colors.muted,
      fontFamily: theme.typography.bodyFamily
    }
  });
