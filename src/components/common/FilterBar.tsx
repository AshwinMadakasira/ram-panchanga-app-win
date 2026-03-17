/*
 * Component teaching note:
 * A filter bar is just a reusable row of selectable options.
 * Making it generic lets many screens share the same interaction pattern.
 */
import { ScrollView, StyleSheet } from "react-native";

// The generic `<T extends string>` type means this component can work with any string-based filter category.
import { SelectableChip } from "@/components/common/SelectableChip";
import { useAppTheme } from "@/theme";

type FilterBarProps<T extends string> = {
  options: readonly T[];
  value: T;
  labelMap: Record<T, string>;
  onChange: (value: T) => void;
};

/** Render a horizontally scrollable row of selectable filter pills. */
export const FilterBar = <T extends string>({ options, value, labelMap, onChange }: FilterBarProps<T>) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {options.map((option) => {
        const active = option === value;
        return (
          <SelectableChip key={option} label={labelMap[option]} active={active} onPress={() => onChange(option)} />
        );
      })}
    </ScrollView>
  );
};

/** Build this component's theme-aware styles. */
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.sm
    }
  });
