import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "@/i18n";
import { useAuthStore } from "@/store/authStore";
import { Input, Button, Text, ErrorMessage } from "@/components/ui";
import { Mail } from "lucide-react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export const ForgotPasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    let isValid = true;

    // Reset errors
    setEmailError("");

    // Validate email
    if (!email) {
      setEmailError(t("errors.requiredField"));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t("errors.invalidEmail"));
      isValid = false;
    }

    return isValid;
  };

  const handleResetPassword = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (validateForm()) {
      const success = await resetPassword(email);

      if (success) {
        setIsSuccess(true);
      }
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  if (isSuccess) {
    return (
      <View style={styles.container}>
        <Text variant="h3" center style={styles.title}>
          {t("auth.resetPassword")}
        </Text>

        <Text variant="body" center style={styles.successMessage}>
          We have sent a password reset link to your email address. Please check
          your inbox and follow the instructions.
        </Text>

        <Button
          title={t("auth.login")}
          onPress={handleBackToLogin}
          fullWidth
          style={styles.backButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && <ErrorMessage message={error} onRetry={() => clearError()} />}

      <Text variant="h3" center style={styles.title}>
        {t("auth.resetPassword")}
      </Text>

      <Text variant="body" center style={styles.description}>
        Enter your email address and we'll send you a link to reset your
        password.
      </Text>

      <Input
        label={t("auth.email")}
        value={email}
        onChangeText={setEmail}
        placeholder="example@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon={<Mail size={20} />}
        error={emailError}
      />

      <Button
        title={t("auth.resetPassword")}
        onPress={handleResetPassword}
        loading={isLoading}
        fullWidth
        style={styles.resetButton}
      />

      <Button
        title={t("common.back")}
        onPress={handleBackToLogin}
        variant="ghost"
        fullWidth
        style={styles.backButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 32,
  },
  resetButton: {
    marginTop: 16,
  },
  backButton: {
    marginTop: 16,
  },
  successMessage: {
    marginBottom: 32,
  },
});

export default ForgotPasswordForm;
