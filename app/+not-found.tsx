/*
 * Screen teaching note:
 * This fallback route is shown when a path does not match any screen.
 * Even small apps benefit from a safe failure screen for broken links or bad deep links.
 */
import { Link } from "expo-router";
import { StyleSheet, Text } from "react-native";

// Shared components keep even fallback screens visually consistent with the rest of the app.
import { EmptyState } from "@/components/common/EmptyState";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { useAppTheme } from "@/theme";

export default function NotFoundScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <ScreenContainer title="Screen not found" showBack>
      <EmptyState title="Screen not found" message="The route you opened does not exist in this build." />
      <Link href="/" asChild>
        <Text style={styles.link}>Return home</Text>
      </Link>
    </ScreenContainer>
  );
}

/** Create theme-aware styles for the not-found screen. */
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    link: {
      color: theme.colors.maroon,
      fontFamily: theme.typography.bodyStrongFamily
    }
  });
