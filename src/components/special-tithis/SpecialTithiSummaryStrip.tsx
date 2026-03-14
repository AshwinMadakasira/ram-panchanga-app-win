import { memo, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/theme";
import type { SpecialTithi } from "@/types/domain";

type StatCardProps = {
  label: string;
  value: string;
  accent?: boolean;
};

const StatCard = ({ label, value, accent = false }: StatCardProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.statCard, accent && styles.statCardAccent]}>
      <Text style={[styles.statValue, accent && styles.statValueAccent]}>{value}</Text>
      <Text style={[styles.statLabel, accent && styles.statLabelAccent]}>{label}</Text>
    </View>
  );
};

const SpecialTithiSummaryStripComponent = ({ specialTithis }: { specialTithis: SpecialTithi[] }) => {
  const summary = useMemo(() => {
    const uniqueDates = new Set<string>();
    let ekadashiCount = 0;
    let punyadinaCount = 0;

    specialTithis.forEach((entry) => {
      if (entry.date) {
        uniqueDates.add(entry.date);
      }
      if (entry.category === "ekadashi") {
        ekadashiCount += 1;
      }
      if (entry.category === "punyadina") {
        punyadinaCount += 1;
      }
    });

    return {
      uniqueDateCount: uniqueDates.size,
      ekadashiCount,
      punyadinaCount
    };
  }, [specialTithis]);

  return (
    <View style={styles.container}>
      <StatCard label="Entries" value={String(specialTithis.length)} accent />
      <StatCard label="Dates" value={String(summary.uniqueDateCount)} />
      <StatCard label="Ekadashis" value={String(summary.ekadashiCount)} />
      <StatCard label="Punyadinas" value={String(summary.punyadinaCount)} />
    </View>
  );
};

export const SpecialTithiSummaryStrip = memo(SpecialTithiSummaryStripComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  }
});

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    statCard: {
      minWidth: 104,
      flexGrow: 1,
      backgroundColor: theme.colors.card,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      gap: 4
    },
    statCardAccent: {
      backgroundColor: theme.colors.surfaceAccent,
      borderColor: theme.colors.gold
    },
    statValue: {
      color: theme.colors.ink,
      fontSize: 22,
      fontWeight: "700",
      fontFamily: theme.typography.headingFamily
    },
    statValueAccent: {
      color: theme.colors.maroon
    },
    statLabel: {
      color: theme.colors.muted,
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      fontFamily: theme.typography.bodyFamily
    },
    statLabelAccent: {
      color: theme.colors.saffron
    }
  });
