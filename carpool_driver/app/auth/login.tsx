import React, { useState, useCallback, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Lock, Phone } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Layout from "@/constants/layout";
import { useAuthStore } from "@/store/auth-store";

// Memoized input component for better performance
const MemoizedInput = memo(Input);

export default function LoginScreen() {
  const { login, isLoading, error } = useAuthStore();
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();

  const [phone, setPhone] = useState("0981197563");
  const [password, setPassword] = useState("mypassword");
  const [validationErrors, setValidationErrors] = useState({
    phone: "",
    password: "",
  });

  const validateForm = useCallback(() => {
    let isValid = true;
    const errors = {
      phone: "",
      password: "",
    };

    if (!phone) {
      errors.phone = t("phoneRequired");
      isValid = false;
    } else if (!/^0\d{9}$/.test(phone)) {
      errors.phone = t("phoneInvalid");
      isValid = false;
    }

    if (!password) {
      errors.password = t("passwordRequired");
      isValid = false;
    } else if (password.length < 6) {
      errors.password = t("passwordMinLength");
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  }, [phone, password, t]);

  const handleLogin = useCallback(async () => {
    if (validateForm()) {
      try {
        const result = await login(phone, password);
        if (result) router.replace("/");
      } catch (error) {
        console.error("Login error:", error);
      }
    }
  }, [validateForm, login, phone, password, router]);

  const handleForgotPassword = useCallback(() => {
    router.push("/auth/forgot-password");
  }, [router]);

  const handleSignUp = useCallback(() => {
    router.push("/auth/signup");
  }, [router]);

  const handlephoneChange = useCallback(
    (text: string) => {
      setPhone(text);
      if (validationErrors.phone) {
        setValidationErrors((prev) => ({ ...prev, phone: "" }));
      }
    },
    [validationErrors.phone]
  );

  const handlePasswordChange = useCallback(
    (text: string) => {
      setPassword(text);
      if (validationErrors.password) {
        setValidationErrors((prev) => ({ ...prev, password: "" }));
      }
    },
    [validationErrors.password]
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {t("welcomeBack")}
            </Text>
          </View>

          <View style={styles.form}>
            <MemoizedInput
              label={t("phone_number")}
              placeholder={t("enterYourPhoneNumber")}
              value={phone}
              onChangeText={handlephoneChange}
              keyboardType="phone-pad"
              autoCapitalize="none"
              leftIcon={<Phone size={20} color={colors.gray} />}
              error={validationErrors.phone}
              colors={colors}
            />

            <MemoizedInput
              label={t("password")}
              placeholder={t("enterYourPassword")}
              value={password}
              onChangeText={handlePasswordChange}
              isPassword
              leftIcon={<Lock size={20} color={colors.gray} />}
              error={validationErrors.password}
              colors={colors}
            />

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text
                style={[styles.forgotPasswordText, { color: colors.primary }]}
              >
                {t("forgotPassword")}
              </Text>
            </TouchableOpacity>

            {error && (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {error}
              </Text>
            )}

            <Button
              title={t("login")}
              onPress={handleLogin}
              isLoading={isLoading}
              style={styles.loginButton}
              colors={colors}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              {t("dontHaveAccount")}
            </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={[styles.signUpText, { color: colors.primary }]}>
                {t("signup")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    padding: Layout.spacing.l,
    justifyContent: "center",
  },
  header: {
    marginBottom: Layout.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: Layout.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    marginBottom: Layout.spacing.xl,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: Layout.spacing.l,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  errorText: {
    marginBottom: Layout.spacing.m,
    fontSize: 14,
  },
  loginButton: {
    marginTop: Layout.spacing.m,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Layout.spacing.xs,
  },
  footerText: {
    fontSize: 14,
  },
  signUpText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
