import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";
import { Text, Button, Input, ErrorMessage } from "@/components/ui";
import { Mail, ArrowLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getColors } from "@/constants/color";
import { useTranslation } from "@/constants/i18n";
import layout from "@/constants/layout";

export default function ForgotPasswordScreen() {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { t } = useTranslation();
  const router = useRouter();
  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    let isValid = true;
    clearError();

    if (!email) {
      setEmailError(t("errors.requiredField"));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t("errors.invalidEmail"));
      isValid = false;
    } else {
      setEmailError("");
    }

    return isValid;
  };

  const handleResetPassword = async () => {
    if (validateForm()) {
      const success = await resetPassword(email);
      if (success) {
        setIsSubmitted(true);
      }
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.theme.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.theme.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text variant="h2" color={colors.theme.text} style={styles.title}>
            {t("auth.forgotPassword")}
          </Text>

          {!isSubmitted ? (
            <>
              <Text
                variant="body"
                color={colors.theme.textSecondary}
                style={styles.subtitle}
              >
                {t("auth.resetPasswordInstructions")}
              </Text>

              {error && <ErrorMessage message={error} />}

              <Input
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError("");
                  if (error) clearError();
                }}
                placeholder={t("auth.email")}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Mail size={20} color={colors.theme.textSecondary} />}
                error={emailError}
              />

              <Button
                title={t("auth.resetPassword")}
                onPress={handleResetPassword}
                loading={isLoading}
                style={styles.resetButton}
              />
            </>
          ) : (
            <>
              <Text
                variant="body"
                color={colors.theme.success}
                style={styles.successMessage}
              >
                We have sent password reset instructions to your email.
              </Text>

              <Button
                title={t("auth.login")}
                onPress={() => router.replace("/auth/login")}
                style={styles.loginButton}
              />
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    padding: layout.spacing.m,
  },
  backButton: {
    padding: layout.spacing.s,
  },
  content: {
    flex: 1,
    padding: layout.spacing.l,
    justifyContent: "center",
  },
  title: {
    marginBottom: layout.spacing.m,
  },
  subtitle: {
    marginBottom: layout.spacing.xl,
  },
  resetButton: {
    marginTop: layout.spacing.m,
  },
  successMessage: {
    textAlign: "center",
    marginBottom: layout.spacing.xl,
  },
  loginButton: {
    marginTop: layout.spacing.m,
  },
});
