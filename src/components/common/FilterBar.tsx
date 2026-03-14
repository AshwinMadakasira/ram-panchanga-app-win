import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { useAppTheme } from "@/theme";

type FilterBarProps<T extends string> = {
  options: readonly T[];
  value: T;
  labelMap: Record<T, string>;
  onChange: (value: T) => void;
};

export const FilterBar = <T extends string>({ options, value, labelMap, onChange }: FilterBarProps<T>) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {options.map((option) => {
        const active = option === value;
        return (
          <Pressable key={option} onPress={() => onChange(option)} style={[styles.pill, active && styles.pillActive]}>
            <Text style={[styles.label, active && styles.labelActive]}>{labelMap[option]}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.sm
    },
    pill: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.pill,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 10
    },
    pillActive: {
      backgroundColor: theme.colors.maroon,
      borderColor: theme.colors.maroon
    },
    label: {
      color: theme.colors.ink,
      fontSize: 14,
      fontWeight: "600",
      fontFamily: theme.typography.bodyFamily
    },
    labelActive: {
      color: "#fff9f2"
    }
  });
