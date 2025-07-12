import React, { ReactNode } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { Text } from "./Text";
import { getColors } from "@/constants/color";
import layout from "@/constants/layout";

interface InputProps extends TextInputProps {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  props?: any;
}

export function Input({
  leftIcon,
  rightIcon,
  error,
  label,
  containerStyle,
  ...props
}: InputProps) {
  const { theme } = useThemeStore();
  const colors = getColors(theme);

  return (
    <View style={styles.container}>
      {label && (
        <Text
          variant="bodySmall"
          color={colors.theme.textSecondary}
          style={styles.label}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? colors.theme.error : colors.theme.border,
            backgroundColor: theme === "light" ? "#f9f9f9" : "#2c2c2c",
          },
          containerStyle,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            {
              color: colors.theme.text,
              paddingLeft: leftIcon ? 0 : layout.spacing.m,
              paddingRight: rightIcon ? 0 : layout.spacing.m,
            },
          ]}
          placeholderTextColor={colors.theme.placeholder}
          {...props}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {error && (
        <Text
          variant="bodySmall"
          color={colors.theme.error}
          style={styles.errorText}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: layout.spacing.m,
  },
  label: {
    marginBottom: layout.spacing.xs,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: layout.borderRadius.medium,
    height: 50,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: layout.fontSize.m,
  },
  leftIcon: {
    paddingHorizontal: layout.spacing.ms,
  },
  rightIcon: {
    paddingHorizontal: layout.spacing.ms,
  },
  errorText: {
    marginTop: layout.spacing.xs,
  },
});
