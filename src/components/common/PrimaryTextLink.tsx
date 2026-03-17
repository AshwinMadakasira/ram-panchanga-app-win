/*
 * Component teaching note:
 * This is a lightweight call-to-action link for moments where a full button would feel too heavy.
 */
import { Link } from "expo-router";
import { StyleSheet, Text } from "react-native";
import type { Href } from "expo-router";

// `Href` gives route strings a safer TypeScript type instead of using plain `string`.
import { useAppTheme } from "@/theme";

/** Render a text-styled navigation link. */
export const PrimaryTextLink = ({ href, label }: { href: Href; label: string }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <Link href={href} asChild>
      <Text style={styles.link}>{label}</Text>
    </Link>
  );
};

/** Build this component's theme-aware styles. */
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    link: {
      color: theme.colors.maroon,
      fontSize: 15,
      fontFamily: theme.typography.bodyStrongFamily
    }
  });
