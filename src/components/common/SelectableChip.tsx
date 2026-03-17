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
  fit?: boolean;
};

/** Render one theme-aware selectable chip. */
export const SelectableChip = ({ label, active, onPress, fit = false }: SelectableChipProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Pressable onPress={onPress} style={[styles.chip, fit && styles.chipFit, active && styles.chipActive]}>
      <Text
        adjustsFontSizeToFit={fit}
        minimumFontScale={0.72}
        numberOfLines={1}
        style={[styles.label, fit && styles.labelFit, active && styles.labelActive]}
      >
        {label}
      </Text>
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
    chipFit: {
      alignItems: "center",
      flex: 1,
      minWidth: 0,
      paddingHorizontal: 8
    },
    chipActive: {
      backgroundColor: theme.colors.maroon,
      borderColor: theme.colors.maroon
    },
    label: {
      color: theme.colors.ink,
      fontFamily: theme.typography.bodyStrongFamily,
      fontSize: Math.round(14 * theme.typography.compactScale)
    },
    labelFit: {
      fontSize: Math.round(13 * theme.typography.compactScale),
      textAlign: "center"
    },
    labelActive: {
      color: "#fff8f1"
    }
  });
