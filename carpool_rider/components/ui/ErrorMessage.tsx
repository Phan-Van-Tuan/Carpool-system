import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { Text } from "./Text";
import { AlertCircle, X } from "lucide-react-native";
import { getColors } from "@/constants/color";
import layout from "@/constants/layout";

type ErrorMessageProps = {
  message: string;
  onClose?: () => void;
};

export function ErrorMessage({ message, onClose }: ErrorMessageProps) {
  const { theme } = useThemeStore();
  const colors = getColors(theme);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme === "light"
              ? "rgba(255, 59, 48, 0.1)"
              : "rgba(255, 69, 58, 0.2)",
          borderColor: colors.theme.error,
        },
      ]}
    >
      <AlertCircle size={20} color={colors.theme.error} style={styles.icon} />
      <Text variant="body" color={colors.theme.error} style={styles.message}>
        {message}
      </Text>

      {onClose && (
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={16} color={colors.theme.error} />
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: layout.spacing.m,
    borderRadius: layout.borderRadius.medium,
    borderWidth: 1,
    marginBottom: layout.spacing.m,
  },
  icon: {
    marginRight: layout.spacing.s,
  },
  message: {
    flex: 1,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
