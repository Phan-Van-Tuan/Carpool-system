import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useAuthStore } from "@/store/authStore";
import { Input, Button, Text, ErrorMessage } from "@/components/ui";
import { Mail, Lock } from "lucide-react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useTranslation } from "@/constants/i18n";

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateForm = () => {
    let isValid = true;

    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Validate email
    if (!email) {
      setEmailError(t("errors.requiredField"));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t("errors.invalidEmail"));
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError(t("errors.requiredField"));
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (validateForm()) {
      await login(email, password);
    }
  };

  const handleForgotPassword = () => {
    router.push("/auth/forgot-password");
  };

  const handleRegister = () => {
    router.push("/auth/register");
  };

  return (
    <View style={styles.container}>
      {error && <ErrorMessage message={error} onRetry={() => clearError()} />}

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

      <Input
        label={t("auth.password")}
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
        leftIcon={<Lock size={20} />}
        error={passwordError}
        // showPasswordToggle
      />

      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={handleForgotPassword}
      >
        <Text variant="bodySmall" color="#2ecc71">
          {t("auth.forgotPassword")}
        </Text>
      </TouchableOpacity>

      <Button
        title={t("auth.login")}
        onPress={handleLogin}
        loading={isLoading}
        // fullWidth
        style={styles.loginButton}
      />

      <View style={styles.registerContainer}>
        <Text variant="body">{t("auth.dontHaveAccount")}</Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text variant="body" color="#2ecc71" style={styles.registerText}>
            {t("auth.register")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 8,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: {
    marginLeft: 4,
    fontWeight: "600",
  },
});

export default LoginForm;
