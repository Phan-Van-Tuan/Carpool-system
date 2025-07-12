import React, { memo } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from "react-native";
import Layout from "@/constants/layout";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "danger" | "success" | "text";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  colors: any; // Pass theme colors
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "medium",
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  colors,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...styles[size],
    };

    if (disabled) {
      return {
        ...baseStyle,
        backgroundColor:
          variant === "outline" || variant === "text"
            ? "transparent"
            : colors.lightGray,
        borderColor: variant === "outline" ? colors.lightGray : undefined,
        ...style,
      };
    }

    const variantStyles: Record<string, ViewStyle> = {
      primary: { backgroundColor: colors.primary },
      secondary: { backgroundColor: colors.secondary },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: colors.primary,
      },
      danger: { backgroundColor: colors.danger },
      success: { backgroundColor: colors.success },
      text: {
        backgroundColor: "transparent",
        paddingHorizontal: 0,
        paddingVertical: 0,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...style,
    };
  };

  const getTextStyle = () => {
    const baseStyle: TextStyle = {
      ...styles.text,
      ...styles[`${size}Text`],
    };

    if (disabled) {
      return {
        ...baseStyle,
        color: colors.gray,
        ...textStyle,
      };
    }

    const variantTextStyles: Record<string, TextStyle> = {
      primary: { color: colors.white },
      secondary: { color: colors.white },
      outline: { color: colors.primary },
      danger: { color: colors.white },
      success: { color: colors.white },
      text: { color: colors.primary },
    };

    return {
      ...baseStyle,
      ...variantTextStyles[variant],
      ...textStyle,
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "outline" || variant === "text"
              ? colors.primary
              : colors.white
          }
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={getTextStyle()}>{title}</Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: Layout.borderRadius.medium,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Layout.spacing.m,
  },
  text: {
    fontWeight: "600",
  },
  small: {
    paddingVertical: Layout.spacing.ms,
    paddingHorizontal: Layout.spacing.ml,
    borderRadius: Layout.borderRadius.small,
  },
  medium: {
    paddingVertical: Layout.spacing.ml,
    paddingHorizontal: Layout.spacing.l,
  },
  large: {
    paddingVertical: Layout.spacing.l,
    paddingHorizontal: Layout.spacing.xxl,
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },
});

// Memoize the component to prevent unnecessary re-renders
export default memo(Button);
