/*
 * Component teaching note:
 * This list renders special tithis as tappable rows.
 * Notice the separation of concerns: the component decides how a list item looks,
 * while route helpers decide where a tap should navigate.
 */
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Route helpers keep navigation targets typed, while the theme keeps styling consistent.
import { useAppLocalization } from "@/i18n";
import { useAppTheme } from "@/theme";
import { dayRoute } from "@/types/navigation";
import type { SpecialTithi } from "@/types/domain";

/** Render a tappable list of special tithi entries. */
export const SpecialTithiList = ({ specialTithis }: { specialTithis: SpecialTithi[] }) => {
  const theme = useAppTheme();
  const { dynamic } = useAppLocalization();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {specialTithis.map((specialTithi) => {
        const canNavigate = Boolean(specialTithi.date);

        return (
          <Pressable
            key={specialTithi.id}
            disabled={!canNavigate}
            onPress={() => {
              if (specialTithi.date) {
                router.push(dayRoute(specialTithi.date));
              }
            }}
            style={({ pressed }) => [styles.item, canNavigate && pressed && styles.itemPressed]}
          >
            <Text style={styles.name}>{dynamic(specialTithi.name)}</Text>
            <Text style={styles.meta}>{[dynamic(specialTithi.category), specialTithi.date].filter(Boolean).join(" | ")}</Text>
            {specialTithi.description ? <Text style={styles.description}>{dynamic(specialTithi.description)}</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
};

/** Build this component's theme-aware styles. */
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.sm
    },
    item: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      padding: theme.spacing.md,
      gap: 4
    },
    itemPressed: {
      opacity: 0.82
    },
    name: {
      color: theme.colors.ink,
      fontSize: 17,
      fontFamily: theme.typography.headingFamily
    },
    meta: {
      color: theme.colors.saffron,
      fontSize: 15,
      textTransform: "capitalize",
      fontFamily: theme.typography.bodyStrongFamily
    },
    description: {
      color: theme.colors.muted,
      fontSize: 15,
      lineHeight: 20,
      fontFamily: theme.typography.bodyFamily
    }
  });
