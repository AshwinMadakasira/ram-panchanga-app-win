/*
 * Component teaching note:
 * Shared section headers make long information screens feel structured and predictable.
 */
import { StyleSheet, Text, View } from "react-native";

// Shared theme tokens keep section headings visually aligned across many screens.
import { useAppTheme } from "@/theme";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
};

/** Render a reusable section title with an optional subtitle. */
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

/** Build this component's theme-aware styles. */
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
