import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/color";
import { Text } from "./Text";
import layout from "@/constants/layout";

interface SpinnerProps {
  size?: "small" | "large";
  text?: string;
  color?: string;
}

export function Spinner({ size = "small", text, color }: SpinnerProps) {
  const { theme } = useThemeStore();
  const colors = getColors(theme);

  const spinnerColor = color || colors.primary;

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={spinnerColor} />
      {text && (
        <Text
          variant="body"
          color={colors.theme.textSecondary}
          style={styles.text}
        >
          {text}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: layout.spacing.s,
  },
});
