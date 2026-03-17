/*
 * Screen teaching note:
 * This screen focuses on a curated subset of the data rather than the full daily record.
 * It also demonstrates filter-driven queries: the chosen category lives in React state and
 * becomes part of the query key used by React Query.
 */
import { useState } from "react";

// The screen reuses shared layout pieces and domain labels rather than embedding category names directly.
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { FilterBar } from "@/components/common/FilterBar";
import { LoadingState } from "@/components/common/LoadingState";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { SpecialTithiCollection } from "@/components/special-tithis/SpecialTithiCollection";
import { getSpecialTithiCategoryLabels } from "@/domain/panchanga/labels";
import { useSpecialTithis } from "@/hooks/usePanchangaQueries";
import { useSelectedLocation } from "@/hooks/useSelectedLocation";
import { useAppLocalization } from "@/i18n";
import type { SpecialTithiCategory } from "@/types/domain";

const options = ["all", "ekadashi", "pournami", "punyadina"] as const;

export default function SpecialTithisScreen() {
  const { language, text } = useAppLocalization();
  const { locationId, isLoading: locationLoading, error: locationError } = useSelectedLocation();
  const [category, setCategory] = useState<SpecialTithiCategory>("all");
  const { data, error, isLoading } = useSpecialTithis(locationId, { category });
  const categoryLabels = getSpecialTithiCategoryLabels(language);

  return (
    <ScreenContainer title={text.specialTithis} showSearch>
      <FilterBar options={options} value={category} labelMap={categoryLabels} onChange={setCategory} />
      {locationError || error ? <ErrorState message={(locationError ?? error)?.message ?? (language === "kn" ? "ವಿಶೇಷ ತಿಥಿಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಆಗಲಿಲ್ಲ." : "Unable to load special tithis.")} /> : null}
      {locationLoading || isLoading ? (
        <LoadingState
          title={language === "kn" ? "ವಿಶೇಷ ತಿಥಿಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ" : "Loading special tithis"}
          message={language === "kn" ? "ಆಯ್ದ ಫಿಲ್ಟರ್‌ಗಳಿಗೆ ವಿಶೇಷ ತಿಥಿಗಳನ್ನು ಸಂಗ್ರಹಿಸಲಾಗುತ್ತಿದೆ." : "Gathering special tithis for the selected filters."}
        />
      ) : !data || data.length === 0 ? (
        <EmptyState
          title={language === "kn" ? "ವಿಶೇಷ ತಿಥಿಗಳು ಲಭ್ಯವಿಲ್ಲ" : "No special tithis available"}
          message={
            language === "kn"
              ? "ಪಂಚಾಂಗ ದತ್ತಾಂಶ ಸ್ಥಳೀಯ ಡೇಟಾಬೇಸ್‌ಗೆ ಇಂಪೋರ್ಟ್ ಆದ ನಂತರ ಏಕಾದಶಿ ಮತ್ತು ಪುಣ್ಯದಿನ ದಾಖಲೆಗಳು ಇಲ್ಲಿ ಕಾಣುತ್ತವೆ."
              : "Ekadashi, Pournami, and Punyadina entries appear here after Panchanga data has been imported into the local database."
          }
        />
      ) : (
        <SpecialTithiCollection specialTithis={data} />
      )}
    </ScreenContainer>
  );
}
