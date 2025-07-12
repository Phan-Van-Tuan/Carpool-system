import React from "react";
import { Text as RNText, StyleSheet, TextStyle } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/color";
import layout from "@/constants/layout";

type TextVariant = "h1" | "h2" | "h3" | "h4" | "body" | "bodySmall" | "caption";
type TextWeight = "400" | "500" | "600" | "700";

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: string;
  weight?: TextWeight;
  center?: boolean;
  style?: TextStyle | TextStyle[];
  numberOfLines?: number;
  onPress?: () => void;
}

export function Text({
  children,
  variant = "body",
  color,
  weight,
  center = false,
  style,
  numberOfLines,
  onPress,
  ...props
}: TextProps) {
  const { theme } = useThemeStore();
  const colors = getColors(theme);

  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case "h1":
        return {
          fontSize: layout.fontSize.xxxl,
          lineHeight: layout.lineHeight.xxxl,
          fontWeight: "700",
        };
      case "h2":
        return {
          fontSize: layout.fontSize.xxl,
          lineHeight: layout.lineHeight.xxl,
          fontWeight: "700",
        };
      case "h3":
        return {
          fontSize: layout.fontSize.xl,
          lineHeight: layout.lineHeight.xl,
          fontWeight: "600",
        };
      case "h4":
        return {
          fontSize: layout.fontSize.l,
          lineHeight: layout.lineHeight.l,
          fontWeight: "500",
        };
      case "bodySmall":
        return {
          fontSize: layout.fontSize.s,
          lineHeight: layout.lineHeight.s,
          fontWeight: "400",
        };
      case "caption":
        return {
          fontSize: layout.fontSize.xs,
          lineHeight: layout.lineHeight.xs,
          fontWeight: "400",
        };
      default: // body
        return {
          fontSize: layout.fontSize.m,
          lineHeight: layout.lineHeight.m,
          fontWeight: "400",
        };
    }
  };

  return (
    <RNText
      style={[
        getVariantStyle(),
        {
          color: color || colors.theme.text,
          textAlign: center ? "center" : "left",
          fontWeight: weight || getVariantStyle().fontWeight,
        },
        style,
      ]}
      numberOfLines={numberOfLines}
      onPress={onPress}
      {...props}
    >
      {children}
    </RNText>
  );
}
