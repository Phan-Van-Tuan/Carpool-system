import React, { useState, memo } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import Layout from "@/constants/layout";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  colors: any; // Pass theme colors
  require?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  leftIcon,
  rightIcon,
  isPassword = false,
  colors,
  require = false,
  ...props
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(isPassword);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }, labelStyle]}>
          {label} {require && <Text style={{ color: colors.danger }}>*</Text>}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? colors.danger : colors.border,
            backgroundColor: colors.darkGray,
          },
          error ? styles.inputError : null,
          props.editable === false ? styles.inputDisabled : null,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            { color: colors.text },
            leftIcon ? styles.inputWithLeftIcon : null,
            rightIcon || isPassword ? styles.inputWithRightIcon : null,
            inputStyle,
          ]}
          placeholderTextColor={colors.gray}
          secureTextEntry={secureTextEntry}
          {...props}
        />
        {isPassword ? (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={toggleSecureEntry}
          >
            {secureTextEntry ? (
              <Eye size={20} color={colors.gray} />
            ) : (
              <EyeOff size={20} color={colors.gray} />
            )}
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.rightIcon}>{rightIcon}</View>
        ) : null}
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.danger }, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.spacing.l,
  },
  label: {
    fontSize: 14,
    marginBottom: Layout.spacing.s,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Layout.borderRadius.medium,
  },
  input: {
    flex: 1,
    paddingVertical: Layout.spacing.ml,
    paddingHorizontal: Layout.spacing.m,
    fontSize: 16,
  },
  inputWithLeftIcon: {
    paddingLeft: Layout.spacing.ms,
  },
  inputWithRightIcon: {
    paddingRight: Layout.spacing.s,
  },
  leftIcon: {
    paddingLeft: Layout.spacing.ml,
  },
  rightIcon: {
    paddingRight: Layout.spacing.ml,
  },
  inputError: {
    borderWidth: 1,
  },
  inputDisabled: {
    opacity: 0.7,
  },
  error: {
    fontSize: 12,
    marginTop: Layout.spacing.s,
  },
});

// Memoize the component to prevent unnecessary re-renders
export default memo(Input);
