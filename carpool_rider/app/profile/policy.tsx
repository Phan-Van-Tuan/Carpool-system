import { getColors } from "@/constants/color";
import { useThemeStore } from "@/store/themeStore";
import { View, StyleSheet, Text } from "react-native";

export default function PolicyScreen() {
  const { theme } = useThemeStore();
  const colors = getColors(theme);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.theme.background }]}
    >
      <Text style={[styles.title, { color: colors.theme.text }]}>
        Điều khoản
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
});
