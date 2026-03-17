/*
 * Screen teaching note:
 * Search is a compact example of reactive UI. User input is stored in React state,
 * a deferred version of that state avoids overly eager searching, and results come from
 * the local SQLite database through a repository and React Query.
 */
import { router } from "expo-router";
import { useDeferredValue, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

// Search pulls together shared states, a search hook, navigation, and theme styles.
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { SectionHeader } from "@/components/common/SectionHeader";
import { useSearch } from "@/hooks/usePanchangaQueries";
import { useSelectedLocation } from "@/hooks/useSelectedLocation";
import { useAppTheme } from "@/theme";
import { dayRoute } from "@/types/navigation";

const kindLabels = {
  date: "Date",
  special_tithi: "Special Tithi"
} as const;

export default function SearchScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { locationId, isLoading: locationLoading, error: locationError } = useSelectedLocation();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const { data, error, isFetching } = useSearch(deferredQuery, locationId);

  return (
    <ScreenContainer>
      <SectionHeader title="Search" subtitle="Search dates, special tithis, tithi, and nakshatra." />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setQuery}
        placeholder="Search Panchanga"
        placeholderTextColor={theme.colors.muted}
        style={styles.input}
        value={query}
      />
      {locationError || error ? <ErrorState message={(locationError ?? error)?.message ?? "Unable to search Panchanga."} /> : null}
      {query.trim().length === 0 ? (
        <EmptyState title="Start typing" message="Search by date, special tithi, tithi, or nakshatra." />
      ) : locationLoading || isFetching ? (
        <LoadingState title="Searching" message="Looking through locally stored Panchanga data." />
      ) : !data || data.length === 0 ? (
        <EmptyState title="No matches" message="No local results matched the current search query." />
      ) : (
        <View style={styles.results}>
          {data.map((result) => (
            <Pressable key={`${result.kind}-${result.id}`} onPress={() => router.push(dayRoute(result.date))} style={styles.card}>
              <Text style={styles.kind}>{kindLabels[result.kind]}</Text>
              <Text style={styles.title}>{result.title}</Text>
              <Text style={styles.subtitle}>{result.subtitle || result.date}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

/** Create theme-aware styles for the search screen. */
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    input: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      color: theme.colors.ink,
      fontSize: 16,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 14,
      fontFamily: theme.typography.bodyFamily
    },
    results: {
      gap: theme.spacing.sm
    },
    card: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      padding: theme.spacing.md,
      gap: 4
    },
    kind: {
      color: theme.colors.saffron,
      fontSize: 12,
      fontWeight: "700",
      textTransform: "uppercase",
      fontFamily: theme.typography.bodyFamily
    },
    title: {
      color: theme.colors.ink,
      fontSize: 16,
      fontWeight: "700",
      fontFamily: theme.typography.headingFamily
    },
    subtitle: {
      color: theme.colors.muted,
      fontFamily: theme.typography.bodyFamily
    }
  });
