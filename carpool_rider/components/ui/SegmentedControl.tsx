import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { Text } from "./Text";
import { getColors } from "@/constants/color";
import layout from "@/constants/layout";

interface SegmentedControlProps {
  values: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  style?: StyleProp<ViewStyle>;
}

export function SegmentedControl({
  values,
  selectedIndex,
  onChange,
  style,
}: SegmentedControlProps) {
  const { theme } = useThemeStore();
  const colors = getColors(theme);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme === "light" ? "#f2f2f2" : "#2c2c2c",
          borderColor: theme === "light" ? "#e0e0e0" : "#3a3a3c",
        },
        style,
      ]}
    >
      {values.map((value, index) => {
        const isSelected = index === selectedIndex;
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.segment,
              isSelected && {
                backgroundColor: colors.theme.background,
                shadowColor: theme === "light" ? "#000" : "transparent",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 1,
                elevation: 2,
              },
            ]}
            onPress={() => onChange(index)}
            activeOpacity={0.7}
          >
            <Text
              variant="body"
              weight={isSelected ? "600" : "400"}
              color={isSelected ? colors.primary : colors.theme.textSecondary}
            >
              {value}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: layout.borderRadius.medium,
    padding: 4,
    borderWidth: 1,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: layout.borderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
});
