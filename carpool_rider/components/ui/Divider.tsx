import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { Text } from "./Text";
import { getColors } from "@/constants/color";
import layout from "@/constants/layout";

interface DividerProps {
  text?: string;
  orientation?: "horizontal" | "vertical";
  thickness?: number;
  style?: StyleProp<ViewStyle>;
}

export const Divider: React.FC<DividerProps> = ({
  text,
  orientation = "horizontal",
  thickness = 1,
  style,
}) => {
  const { theme } = useThemeStore();
  const colors = getColors(theme);

  if (orientation === "vertical") {
    return (
      <View
        style={[
          styles.vertical,
          {
            width: thickness,
            backgroundColor: colors.theme.border,
          },
          style,
        ]}
      />
    );
  }

  if (text) {
    return (
      <View style={[styles.textContainer, style]}>
        <View
          style={[
            styles.line,
            {
              height: thickness,
              backgroundColor: colors.theme.border,
            },
          ]}
        />
        <Text
          variant="bodySmall"
          color={colors.theme.textSecondary}
          style={styles.text}
        >
          {text}
        </Text>
        <View
          style={[
            styles.line,
            {
              height: thickness,
              backgroundColor: colors.theme.border,
            },
          ]}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.horizontal,
        {
          height: thickness,
          backgroundColor: colors.theme.border,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    width: "100%",
    marginVertical: layout.spacing.m,
  },
  vertical: {
    height: "100%",
    marginHorizontal: layout.spacing.m,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: layout.spacing.m,
  },
  line: {
    flex: 1,
  },
  text: {
    marginHorizontal: layout.spacing.m,
  },
});
