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
import { useSearch } from "@/hooks/usePanchangaQueries";
import { useSelectedLocation } from "@/hooks/useSelectedLocation";
import { useAppLocalization } from "@/i18n";
import { useAppTheme } from "@/theme";
import { dayRoute } from "@/types/navigation";

export default function SearchScreen() {
  const theme = useAppTheme();
  const { language, text, dynamic } = useAppLocalization();
  const styles = createStyles(theme);
  const { locationId, isLoading: locationLoading, error: locationError } = useSelectedLocation();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const { data, error, isFetching } = useSearch(deferredQuery, locationId);

  return (
    <ScreenContainer title={text.search} showBack>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setQuery}
        placeholder={language === "kn" ? "ಪಂಚಾಂಗದಲ್ಲಿ ಹುಡುಕಿ" : "Search Panchanga"}
        placeholderTextColor={theme.colors.muted}
        style={styles.input}
        value={query}
      />
      {locationError || error ? <ErrorState message={(locationError ?? error)?.message ?? (language === "kn" ? "ಪಂಚಾಂಗ ಹುಡುಕಲು ಆಗಲಿಲ್ಲ." : "Unable to search Panchanga.")} /> : null}
      {query.trim().length === 0 ? (
        <EmptyState
          title={language === "kn" ? "ಟೈಪ್ ಮಾಡಲು ಆರಂಭಿಸಿ" : "Start typing"}
          message={language === "kn" ? "ದಿನಾಂಕ, ವಿಶೇಷ ತಿಥಿ, ತಿಥಿ ಅಥವಾ ನಕ್ಷತ್ರದ ಮೂಲಕ ಹುಡುಕಿ." : "Search by date, special tithi, tithi, or nakshatra."}
        />
      ) : locationLoading || isFetching ? (
        <LoadingState
          title={language === "kn" ? "ಹುಡುಕುತ್ತಿದೆ" : "Searching"}
          message={language === "kn" ? "ಸ್ಥಳೀಯವಾಗಿ ಸಂಗ್ರಹಿಸಿದ ಪಂಚಾಂಗ ದತ್ತಾಂಶದಲ್ಲಿ ಹುಡುಕಲಾಗುತ್ತಿದೆ." : "Looking through locally stored Panchanga data."}
        />
      ) : !data || data.length === 0 ? (
        <EmptyState
          title={language === "kn" ? "ಫಲಿತಾಂಶಗಳಿಲ್ಲ" : "No matches"}
          message={language === "kn" ? "ಈ ಹುಡುಕಾಟಕ್ಕೆ ಹೊಂದುವ ಸ್ಥಳೀಯ ಫಲಿತಾಂಶಗಳಿಲ್ಲ." : "No local results matched the current search query."}
        />
      ) : (
        <View style={styles.results}>
          {data.map((result) => (
            <Pressable key={`${result.kind}-${result.id}`} onPress={() => router.push(dayRoute(result.date))} style={styles.card}>
              <Text style={styles.kind}>{result.kind === "date" ? text.date : text.specialTithi}</Text>
              <Text style={styles.title}>{dynamic(result.title) || result.title}</Text>
              <Text style={styles.subtitle}>{dynamic(result.subtitle) || result.subtitle || result.date}</Text>
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
      textTransform: "uppercase",
      fontFamily: theme.typography.bodyStrongFamily
    },
    title: {
      color: theme.colors.ink,
      fontSize: 17,
      fontFamily: theme.typography.headingFamily
    },
    subtitle: {
      color: theme.colors.muted,
      fontSize: 15,
      fontFamily: theme.typography.bodyFamily
    }
  });
