import React from "react";
import { View, StyleSheet, Text as RNText } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/color";

interface BadgeProps {
  count?: number;
  text?: string;
  variant?: "primary" | "success" | "warning" | "error" | "info" | "custom";
  size?: "small" | "medium" | "large";
  color?: string;
  style?: any;
}

export function Badge({
  count,
  text,
  variant = "primary",
  size = "medium",
  color,
  style,
}: BadgeProps) {
  const { theme } = useThemeStore();
  const colors = getColors(theme);

  const getBackgroundColor = () => {
    if (color) return color;

    switch (variant) {
      case "primary":
        return colors.primary;
      case "success":
        return colors.theme.success;
      case "warning":
        return colors.theme.warning;
      case "error":
        return colors.theme.error;
      case "info":
        return colors.theme.info;
      case "custom":
        return color || colors.primary;
      default:
        return colors.primary;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return {
          minWidth: 18,
          height: 18,
          borderRadius: 9,
          paddingHorizontal: count && count > 9 ? 4 : 0,
        };
      case "large":
        return {
          minWidth: 30,
          height: 30,
          borderRadius: 15,
          paddingHorizontal: 8,
        };
      default: // medium
        return {
          minWidth: 24,
          height: 24,
          borderRadius: 12,
          paddingHorizontal: count && count > 9 ? 6 : 0,
        };
    }
  };

  const getTextStyle = () => {
    switch (size) {
      case "small":
        return {
          fontSize: 10,
        };
      case "large":
        return {
          fontSize: 14,
        };
      default: // medium
        return {
          fontSize: 12,
        };
    }
  };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: getBackgroundColor() },
        getSizeStyle(),
        style,
      ]}
    >
      <RNText style={[styles.text, getTextStyle()]}>
        {text || (count !== undefined ? (count > 99 ? "99+" : count) : "")}
      </RNText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
