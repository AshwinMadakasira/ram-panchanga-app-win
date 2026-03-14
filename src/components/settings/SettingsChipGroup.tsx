import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/theme";

type Option = {
  value: string;
  label: string;
};

type SettingsChipGroupProps = {
  options: Option[];
  selectedValues: string[];
  onToggle: (value: string) => void;
};

export const SettingsChipGroup = ({ options, selectedValues, onToggle }: SettingsChipGroupProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const active = selectedValues.includes(option.value);
        return (
          <Pressable
            key={option.value}
            onPress={() => onToggle(option.value)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm
    },
    chip: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.pill,
      paddingHorizontal: 14,
      paddingVertical: 10,
      backgroundColor: theme.colors.card
    },
    chipActive: {
      backgroundColor: theme.colors.maroon,
      borderColor: theme.colors.maroon
    },
    label: {
      color: theme.colors.ink,
      fontWeight: "600",
      fontFamily: theme.typography.bodyFamily
    },
    labelActive: {
      color: "#fff7f0"
    }
  });
