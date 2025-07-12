import React, { ReactNode } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/color";
import layout from "@/constants/layout";

type CardVariant = "flat" | "elevated" | "outlined";

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export function Card({
  children,
  variant = "flat",
  style,
  onPress,
}: CardProps) {
  const { theme } = useThemeStore();
  const colors = getColors(theme);

  const getCardStyle = () => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.theme.background,
      borderRadius: layout.borderRadius.medium,
    };

    switch (variant) {
      case "elevated":
        return {
          ...baseStyle,
          ...layout.shadow.medium,
          backgroundColor:
            theme === "light" ? colors.theme.background : colors.theme.card,
        };
      case "outlined":
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: colors.theme.border,
        };
      case "flat":
        return {
          ...baseStyle,
          borderRadius: 0,
          padding: 0,
          margin: 0,
          border: null,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: theme === "light" ? colors.theme.card : "#1e1e1e",
        };
    }
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[styles.card, getCardStyle(), style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: layout.spacing.m,
    marginBottom: layout.spacing.m,
  },
});
