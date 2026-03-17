/*
 * Component teaching note:
 * This component groups special tithi entries by date and then renders each date as a richer card.
 * It is a good example of a component doing light view-model work before rendering.
 */
import { router } from "expo-router";
import { memo, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Formatting and labeling helpers are imported so the component can stay focused on grouping and rendering.
import { getSpecialTithiCategoryLabels } from "@/domain/panchanga/labels";
import { localizeDisplayDate, useAppLocalization } from "@/i18n";
import { useAppTheme } from "@/theme";
import { dayRoute } from "@/types/navigation";
import type { SpecialTithi } from "@/types/domain";

type SpecialTithiCollectionProps = {
  specialTithis: SpecialTithi[];
};

/** Pick badge colors based on special tithi category. */
const categoryAccent = (category: SpecialTithi["category"], colors: ReturnType<typeof useAppTheme>["colors"]) => {
  switch (category) {
    case "ekadashi":
      return { backgroundColor: colors.maroon, textColor: "#fff8f2" };
    case "punyadina":
      return { backgroundColor: colors.gold, textColor: colors.ink };
    case "pournami":
      return { backgroundColor: colors.surfaceAccent, textColor: colors.maroon };
    case "vrata":
      return { backgroundColor: colors.saffron, textColor: "#fff8f2" };
    case "sankramana":
      return { backgroundColor: colors.success, textColor: "#f7fff8" };
    default:
      return { backgroundColor: colors.cardMuted, textColor: colors.ink };
  }
};

/** Group special tithi entries by date and render each date as a richer card section. */
const SpecialTithiCollectionComponent = ({ specialTithis }: SpecialTithiCollectionProps) => {
  const theme = useAppTheme();
  const { language, dynamic } = useAppLocalization();
  const styles = createStyles(theme);
  const categoryLabels = getSpecialTithiCategoryLabels(language);

  const groupedEntries = useMemo(() => {
    const grouped = specialTithis.reduce<Record<string, SpecialTithi[]>>((accumulator, entry) => {
      const key = entry.date ?? "unknown";
      const current = accumulator[key];
      if (current) {
        current.push(entry);
      } else {
        accumulator[key] = [entry];
      }
      return accumulator;
    }, {});

    return Object.keys(grouped)
      .sort((left, right) => left.localeCompare(right))
      .map((date) => ({
        date,
        entries: grouped[date]
      }));
  }, [specialTithis]);

  return (
    <View style={styles.container}>
      {groupedEntries.map(({ date, entries }) => (
        <View key={date} style={styles.dayCard}>
          <View style={styles.dayHeader}>
            <View style={styles.dayHeaderText}>
              <Text style={styles.dayTitle}>{date === "unknown" ? (language === "kn" ? "ದಿನಾಂಕ ಲಭ್ಯವಿಲ್ಲ" : "Date unavailable") : localizeDisplayDate(date, language)}</Text>
              <Text style={styles.daySubtitle}>
                {entries.length} {language === "kn" ? "ದಾಖಲೆಗಳು" : entries.length === 1 ? "entry" : "entries"}
              </Text>
            </View>
            {date !== "unknown" ? (
              <Pressable onPress={() => router.push(dayRoute(date))} style={styles.dayLink}>
                <Text style={styles.dayLinkLabel}>{language === "kn" ? "ದಿನ ತೆರೆ" : "Open day"}</Text>
              </Pressable>
            ) : null}
          </View>
          <View style={styles.entryList}>
            {entries.map((entry) => {
              const accent = categoryAccent(entry.category, theme.colors);
              return (
                <Pressable
                  key={entry.id}
                  onPress={() => {
                    if (entry.date) {
                      router.push(dayRoute(entry.date));
                    }
                  }}
                  style={({ pressed }) => [styles.entryCard, pressed && entry.date ? styles.entryCardPressed : null]}
                >
                  <View style={styles.entryHeader}>
                    <View style={[styles.badge, { backgroundColor: accent.backgroundColor }]}>
                      <Text style={[styles.badgeLabel, { color: accent.textColor }]}>
                        {categoryLabels[entry.category ?? "festival"]}
                      </Text>
                    </View>
                    <Text numberOfLines={3} style={styles.entryName}>
                      {dynamic(entry.name)}
                    </Text>
                  </View>
                  {entry.description ? <Text style={styles.entryDescription}>{dynamic(entry.description)}</Text> : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
};

export const SpecialTithiCollection = memo(SpecialTithiCollectionComponent);

/** Build this component's theme-aware styles. */
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.md
    },
    dayCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      gap: theme.spacing.md,
      shadowColor: theme.colors.shadow,
      shadowOpacity: theme.isDark ? 0 : 1,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: theme.isDark ? 0 : 2
    },
    dayHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: theme.spacing.md
    },
    dayHeaderText: {
      flex: 1,
      gap: 2
    },
    dayTitle: {
      color: theme.colors.ink,
      fontSize: 19,
      fontFamily: theme.typography.headingFamily
    },
    daySubtitle: {
      color: theme.colors.muted,
      fontSize: 15,
      fontFamily: theme.typography.bodyFamily
    },
    dayLink: {
      backgroundColor: theme.colors.surfaceAccent,
      borderRadius: theme.radii.pill,
      paddingHorizontal: 14,
      paddingVertical: 10
    },
    dayLinkLabel: {
      color: theme.colors.maroon,
      fontSize: 13,
      fontFamily: theme.typography.bodyStrongFamily
    },
    entryList: {
      gap: theme.spacing.sm
    },
    entryCard: {
      backgroundColor: theme.colors.ivory,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      gap: 8
    },
    entryCardPressed: {
      opacity: 0.86
    },
    entryHeader: {
      gap: 10
    },
    badge: {
      alignSelf: "flex-start",
      borderRadius: theme.radii.pill,
      paddingHorizontal: 10,
      paddingVertical: 6
    },
    badgeLabel: {
      fontSize: 11,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      fontFamily: theme.typography.bodyStrongFamily
    },
    entryName: {
      color: theme.colors.ink,
      fontSize: 16,
      lineHeight: 21,
      fontFamily: theme.typography.headingFamily
    },
    entryDescription: {
      color: theme.colors.muted,
      fontSize: 15,
      lineHeight: 20,
      fontFamily: theme.typography.bodyFamily
    }
  });
