import React from "react";
import {
  Switch as RNSwitch,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { Text } from "./Text";
import { getColors } from "@/constants/color";
import layout from "@/constants/layout";

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  label,
  disabled = false,
  style,
}) => {
  const { theme } = useThemeStore();
  const colors = getColors(theme);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text
          variant="body"
          color={disabled ? colors.theme.disabled : colors.theme.text}
          style={styles.label}
        >
          {label}
        </Text>
      )}
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: colors.theme.disabled,
          true: colors.primary + "80", // 80% opacity
        }}
        thumbColor={value ? colors.primary : colors.theme.card}
        ios_backgroundColor={colors.theme.disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: layout.spacing.s,
  },
  label: {
    flex: 1,
    marginRight: layout.spacing.m,
  },
});
