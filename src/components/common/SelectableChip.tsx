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
  multiline?: boolean;
  shrinkToFit?: boolean;
};

/** Render one theme-aware selectable chip. */
export const SelectableChip = ({
  label,
  active,
  onPress,
  fit = false,
  multiline = false,
  shrinkToFit = true
}: SelectableChipProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, fit && styles.chipFit, multiline && styles.chipMultiline, active && styles.chipActive]}
    >
      <Text
        adjustsFontSizeToFit={fit && !multiline && shrinkToFit}
        minimumFontScale={0.72}
        numberOfLines={multiline ? 2 : 1}
        style={[styles.label, fit && styles.labelFit, multiline && styles.labelMultiline, active && styles.labelActive]}
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
    chipMultiline: {
      justifyContent: "center",
      minHeight: 60,
      paddingVertical: 8
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
    labelMultiline: {
      fontSize: Math.round(12 * theme.typography.compactScale),
      lineHeight: Math.round(15 * theme.typography.compactScale),
      textAlign: "center"
    },
    labelActive: {
      color: "#fff8f1"
    }
  });
