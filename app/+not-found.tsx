import { Link } from "expo-router";
import { StyleSheet, Text } from "react-native";

import { EmptyState } from "@/components/common/EmptyState";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { useAppTheme } from "@/theme";

export default function NotFoundScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <ScreenContainer>
      <EmptyState title="Screen not found" message="The route you opened does not exist in this build." />
      <Link href="/" asChild>
        <Text style={styles.link}>Return home</Text>
      </Link>
    </ScreenContainer>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    link: {
      color: theme.colors.maroon,
      fontWeight: "700",
      fontFamily: theme.typography.bodyFamily
    }
  });
