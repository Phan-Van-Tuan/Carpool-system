import { View, Text, StyleSheet } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/color";
import Constants from "expo-constants";

const technologies = [
  "React Native",
  "Expo",
  "TypeScript",
  "Zustand",
  "React Navigation",
  "Expo Router",
  "TanStack Query",
];

export default function AppVersionScreen() {
  const { theme } = useThemeStore();
  const colors = getColors(theme);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.theme.background }]}
    >
      <Text style={[styles.title, { color: colors.theme.text }]}>
        Phiên bản ứng dụng
      </Text>
      <Text style={[styles.version, { color: colors.theme.textSecondary }]}>
        {Constants.manifest?.version ?? "1.0.0"}
      </Text>

      <Text
        style={[styles.techTitle, { color: colors.theme.text, marginTop: 32 }]}
      >
        Công nghệ sử dụng
      </Text>

      <View style={styles.techList}>
        {technologies.map((tech) => (
          <Text
            key={tech}
            style={[styles.techItem, { color: colors.theme.textSecondary }]}
          >
            • {tech}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    fontWeight: "400",
    opacity: 0.7,
  },
  techTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  techList: {
    alignItems: "flex-start",
  },
  techItem: {
    fontSize: 15,
    marginVertical: 2,
  },
});
