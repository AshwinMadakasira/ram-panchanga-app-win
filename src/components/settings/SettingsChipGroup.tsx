/*
 * Component teaching note:
 * This is a reusable multi-select/single-select chip row used by the settings screen.
 */
import { StyleSheet, View } from "react-native";

// This component stays generic so multiple settings sections can reuse it.
import { SelectableChip } from "@/components/common/SelectableChip";
import { useAppTheme } from "@/theme";

type Option = {
  value: string;
  label: string;
};

type SettingsChipGroupProps = {
  options: Option[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  multiline?: boolean;
};

/** Render a single-row settings chip group that compresses chips to fit without scrolling. */
export const SettingsChipGroup = ({ options, selectedValues, onToggle, multiline = false }: SettingsChipGroupProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.row}>
      {options.map((option) => {
        const active = selectedValues.includes(option.value);
        return (
          <SelectableChip
            key={option.value}
            label={option.label}
            active={active}
            fit
            multiline={multiline}
            onPress={() => onToggle(option.value)}
          />
        );
      })}
    </View>
  );
};

/** Build this component's theme-aware styles. */
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      gap: theme.spacing.xs
    }
  });
