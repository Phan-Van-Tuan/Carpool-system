import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/color";
import layout from "@/constants/layout";
import { Text } from "./Text";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  error,
  autoFocus = true,
  style,
}) => {
  const { theme } = useThemeStore();
  const colors = getColors(theme);

  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Create an array of the current OTP digits
  const otpDigits = value.split("");

  // Fill the remaining slots with empty strings
  while (otpDigits.length < length) {
    otpDigits.push("");
  }

  useEffect(() => {
    // Trim the value if it exceeds the length
    if (value.length > length) {
      onChange(value.slice(0, length));
    }
  }, [value, length, onChange]);

  const handlePress = () => {
    inputRef.current?.focus();
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (text: string) => {
    // Only allow numbers
    const cleanedText = text.replace(/[^0-9]/g, "");
    onChange(cleanedText.slice(0, length));
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={[styles.container, style]}>
        <View style={styles.inputsContainer}>
          {otpDigits.map((digit, index) => (
            <View
              key={index}
              style={[
                styles.digitContainer,
                {
                  borderColor: error
                    ? colors.theme.error
                    : isFocused && index === value.length
                    ? colors.primary
                    : colors.theme.border,
                  backgroundColor: colors.theme.background,
                },
              ]}
            >
              <Text variant="h3" color={colors.theme.text} style={styles.digit}>
                {digit}
              </Text>
            </View>
          ))}

          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={handleChange}
            keyboardType="number-pad"
            maxLength={length}
            autoFocus={autoFocus}
            onBlur={handleBlur}
            onFocus={() => setIsFocused(true)}
            style={styles.hiddenInput}
          />
        </View>

        {error && (
          <Text
            variant="caption"
            color={colors.theme.error}
            style={styles.errorText}
          >
            {error}
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginVertical: layout.spacing.m,
  },
  inputsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  digitContainer: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderRadius: layout.borderRadius.medium,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: layout.spacing.xs,
  },
  digit: {
    textAlign: "center",
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  errorText: {
    marginTop: layout.spacing.s,
    textAlign: "center",
  },
});
