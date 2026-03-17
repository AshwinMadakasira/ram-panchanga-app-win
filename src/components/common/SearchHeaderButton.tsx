/*
 * Component teaching note:
 * Small reusable header buttons keep navigation wiring out of larger layout files.
 */
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

// The router is imported directly here because this tiny component owns its own navigation action.
import { useAppTheme } from "@/theme";

/** Render the header button that opens the search route. */
export const SearchHeaderButton = () => {
  const theme = useAppTheme();
  return (
    <Pressable onPress={() => router.push("/search")} style={styles.button}>
      <Ionicons color={theme.colors.ink} name="search-outline" size={20} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center"
  }
});
