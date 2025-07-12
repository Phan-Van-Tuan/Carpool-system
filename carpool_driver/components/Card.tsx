import React, { memo } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Layout from "@/constants/layout";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "elevated" | "outlined";
  colors: any; // Pass theme colors
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = "default",
  colors,
}) => {
  const getCardStyle = () => {
    const baseStyle = {
      ...styles.card,
      backgroundColor: colors.card,
    };

    const variantStyles = {
      default: {},
      elevated: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
      outlined: {
        borderWidth: 1,
        borderColor: colors.border,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...style,
    };
  };

  return <View style={getCardStyle()}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.m,
  },
});

// Memoize the component to prevent unnecessary re-renders
export default memo(Card);
