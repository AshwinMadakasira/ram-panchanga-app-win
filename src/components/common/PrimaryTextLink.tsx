import { Link } from "expo-router";
import { StyleSheet, Text } from "react-native";
import type { Href } from "expo-router";

import { useAppTheme } from "@/theme";

export const PrimaryTextLink = ({ href, label }: { href: Href; label: string }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <Link href={href} asChild>
      <Text style={styles.link}>{label}</Text>
    </Link>
  );
};

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    link: {
      color: theme.colors.maroon,
      fontSize: 15,
      fontWeight: "700",
      fontFamily: theme.typography.bodyFamily
    }
  });
