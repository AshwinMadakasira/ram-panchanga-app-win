import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { FilterBar } from "@/components/common/FilterBar";
import { LoadingState } from "@/components/common/LoadingState";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { SpecialTithiCollection } from "@/components/special-tithis/SpecialTithiCollection";
import { SpecialTithiSummaryStrip } from "@/components/special-tithis/SpecialTithiSummaryStrip";
import { specialTithiCategoryLabels } from "@/domain/panchanga/labels";
import { useSpecialTithis } from "@/hooks/usePanchangaQueries";
import { useSelectedLocation } from "@/hooks/useSelectedLocation";
import { useAppTheme } from "@/theme";
import type { SpecialTithiCategory } from "@/types/domain";

const options = ["all", "ekadashi", "punyadina"] as const;

export default function SpecialTithisScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { locationId, isLoading: locationLoading, error: locationError } = useSelectedLocation();
  const [category, setCategory] = useState<SpecialTithiCategory>("all");
  const { data, error, isLoading } = useSpecialTithis(locationId, { category });

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Curated Almanac</Text>
        <Text style={styles.title}>Special Tithis</Text>
        <Text style={styles.subtitle}>
          Focus on the cleaned structured observances that matter most here: Ekadashi and Punyadina.
        </Text>
      </View>
      <FilterBar options={options} value={category} labelMap={specialTithiCategoryLabels} onChange={setCategory} />
      {locationError || error ? <ErrorState message={(locationError ?? error)?.message ?? "Unable to load special tithis."} /> : null}
      {locationLoading || isLoading ? (
        <LoadingState title="Loading special tithis" message="Gathering special tithis for the selected filters." />
      ) : !data || data.length === 0 ? (
        <EmptyState
          title="No special tithis available"
          message="Ekadashi and Punyadina entries appear here after Panchanga data has been imported into the local database."
        />
      ) : (
        <>
          <SpecialTithiSummaryStrip specialTithis={data} />
          <SpecialTithiCollection specialTithis={data} />
        </>
      )}
    </ScreenContainer>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    hero: {
      backgroundColor: theme.colors.surfaceAccent,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      padding: theme.spacing.lg,
      gap: theme.spacing.sm
    },
    eyebrow: {
      color: theme.colors.saffron,
      fontSize: 12,
      fontWeight: "700",
      letterSpacing: 1.2,
      textTransform: "uppercase",
      fontFamily: theme.typography.bodyFamily
    },
    title: {
      color: theme.colors.ink,
      fontSize: 30,
      fontWeight: "700",
      fontFamily: theme.typography.headingFamily
    },
    subtitle: {
      color: theme.colors.muted,
      lineHeight: 22,
      fontFamily: theme.typography.bodyFamily
    }
  });
