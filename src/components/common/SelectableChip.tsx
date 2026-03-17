/*
 * Component teaching note:
 * This is a small reusable "pill" button used anywhere the app needs a selectable chip.
 * Sharing the visual primitive keeps the app consistent even when different screens arrange the chips differently.
 */
import { Pressable, StyleSheet, Text } from "react-native";

import { useAppTheme } from "@/theme";

type SelectableChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

/** Render one theme-aware selectable chip. */
export const SelectableChip = ({ label, active, onPress }: SelectableChipProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
};

/** Build styles shared by chip-based controls. */
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    chip: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.pill,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 10
    },
    chipActive: {
      backgroundColor: theme.colors.maroon,
      borderColor: theme.colors.maroon
    },
    label: {
      color: theme.colors.ink,
      fontFamily: theme.typography.bodyStrongFamily,
      fontSize: 14
    },
    labelActive: {
      color: "#fff8f1"
    }
  });
