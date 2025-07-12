import React, { ReactNode } from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { Text } from "./Text";
import { getColors } from "@/constants/color";
import layout from "@/constants/layout";

type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = "solid",
  size = "medium",
  icon,
  iconPosition = "left",
  disabled = false,
  loading = false,
  style = {},
  textStyle = {},
}: ButtonProps) {
  const { theme } = useThemeStore();
  const colors = getColors(theme);

  const getBackgroundColor = () => {
    if (disabled) {
      return colors.theme.disabled;
    }

    switch (variant) {
      case "outline":
      case "ghost":
        return "transparent";
      default:
        return colors.primary;
    }
  };

  const getBorderColor = () => {
    if (disabled) {
      return colors.theme.disabled;
    }

    switch (variant) {
      case "outline":
        return colors.primary;
      default:
        return "transparent";
    }
  };

  const getTextColor = () => {
    if (disabled) {
      return colors.theme.textSecondary;
    }

    switch (variant) {
      case "outline":
      case "ghost":
        return colors.primary;
      default:
        return "#ffffff";
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return {
          paddingVertical: layout.spacing.xs,
          paddingHorizontal: layout.spacing.m,
          borderRadius: layout.borderRadius.medium,
        };
      case "large":
        return {
          paddingVertical: layout.spacing.m,
          paddingHorizontal: layout.spacing.xl,
          borderRadius: layout.borderRadius.large,
        };
      default:
        return {
          paddingVertical: layout.spacing.s,
          paddingHorizontal: layout.spacing.l,
          borderRadius: layout.borderRadius.medium,
        };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "small":
        return "bodySmall";
      case "large":
        return "h3";
      default:
        return "body";
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === "outline" ? 1 : 0,
        },
        getSizeStyle(),
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size={size === "small" ? "small" : "small"}
          color={getTextColor()}
        />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <View style={styles.leftIcon}>{icon}</View>
          )}
          <Text
            variant={getTextSize()}
            color={getTextColor()}
            weight="600"
            style={[styles.text, textStyle]}
          >
            {title}
          </Text>
          {icon && iconPosition === "right" && (
            <View style={styles.rightIcon}>{icon}</View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const View = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) => <React.Fragment>{children}</React.Fragment>;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: layout.borderRadius.medium,
  },
  text: {
    textAlign: "center",
    fontWeight: "600",
  },
  leftIcon: {
    marginRight: layout.spacing.s,
  },
  rightIcon: {
    marginLeft: layout.spacing.s,
  },
});
