import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";
import { Text, Button, Input, ErrorMessage } from "@/components/ui";
import { Lock, Phone } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getColors } from "@/constants/color";
import { useTranslation } from "@/constants/i18n";
import layout from "@/constants/layout";
import { regex } from "@/constants/regex";

export default function LoginScreen() {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { t } = useTranslation();
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateForm = () => {
    let isValid = true;
    clearError();

    if (!phone) {
      setPhoneError(t("errors.requiredField"));
      isValid = false;
    } else if (!regex.phone.test(phone)) {
      setPhoneError(t("errors.invalidPhone"));
      isValid = false;
    } else {
      setPhoneError("");
    }

    if (!password) {
      setPasswordError(t("errors.requiredField"));
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(t("errors.invalidPassword"));
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    const success = await login(phone, password);
    if (success) {
      router.replace("/");
    }
    // Nếu thất bại, error đã được set trong store, UI chỉ cần hiển thị error
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.theme.background }]}
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
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text variant="h1" color={colors.primary} style={styles.appName}>
              {t("common.appName")}
            </Text>
            <Text
              variant="body"
              color={colors.theme.textSecondary}
              style={styles.subtitle}
            >
              {t("auth.login")} {t("common.appName")}
            </Text>
          </View>

          <View style={styles.form}>
            {error && <ErrorMessage message={error} />}

            <Input
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (phoneError) setPhoneError("");
                if (error) clearError();
              }}
              placeholder={t("auth.phone")}
              keyboardType="phone-pad"
              autoCapitalize="none"
              leftIcon={<Phone size={20} color={colors.theme.textSecondary} />}
              error={phoneError}
            />

            <Input
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError("");
                if (error) clearError();
              }}
              placeholder={t("auth.password")}
              secureTextEntry
              leftIcon={<Lock size={20} color={colors.theme.textSecondary} />}
              error={passwordError}
            />

            <Link href="/auth/forgot-password" asChild>
              <TouchableOpacity style={styles.forgotPassword}>
                <Text variant="bodySmall" color={colors.primary}>
                  {t("auth.forgotPassword")}
                </Text>
              </TouchableOpacity>
            </Link>

            <Button
              title={t("auth.login")}
              onPress={handleLogin}
              // loading={isLoading}
              style={styles.loginButton}
            />

            <View style={styles.registerContainer}>
              <Text variant="body" color={colors.theme.textSecondary}>
                {t("auth.dontHaveAccount")}
              </Text>
              <Link href="/auth/register" asChild>
                <TouchableOpacity style={styles.registerLink}>
                  <Text variant="body" color={colors.primary} weight="600">
                    {t("auth.signUp")}
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
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
    padding: layout.spacing.l,
  },
  header: {
    alignItems: "center",
    marginTop: layout.spacing.xl,
    marginBottom: layout.spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
  },
  appName: {
    marginTop: layout.spacing.m,
    marginBottom: layout.spacing.xs,
  },
  subtitle: {
    textAlign: "center",
  },
  form: {
    marginTop: layout.spacing.l,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: layout.spacing.l,
  },
  loginButton: {
    marginTop: layout.spacing.m,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: layout.spacing.xl,
  },
  registerLink: {
    marginLeft: layout.spacing.xs,
  },
});
