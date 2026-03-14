import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/theme";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
};

export const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      gap: 4
    },
    title: {
      color: theme.colors.ink,
      fontSize: 20,
      fontWeight: "700",
      fontFamily: theme.typography.headingFamily
    },
    subtitle: {
      color: theme.colors.muted,
      fontSize: 14,
      fontFamily: theme.typography.bodyFamily
    }
  });
