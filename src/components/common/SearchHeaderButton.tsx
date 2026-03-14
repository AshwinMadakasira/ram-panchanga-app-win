import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import { useAppTheme } from "@/theme";

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
