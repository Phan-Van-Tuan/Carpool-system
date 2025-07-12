import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";
import { getColors } from "@/constants/color";
import { Text, Button, Input, ErrorMessage } from "@/components/ui";
import { Mail, Lock, User, Phone } from "lucide-react-native";
import layout from "@/constants/layout";
import { useTranslation } from "@/constants/i18n";
import { api } from "@/services/api";

export default function RegisterScreen() {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { t } = useTranslation();
  const router = useRouter();

  const { register } = useAuthStore();

  useEffect(() => {
    if (!!useAuthStore.getState().registerData) {
      router.push("auth/verify-otp");
    }
  }, []);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const onChange = (field: keyof typeof form) => (text: string) => {
    setForm((prev) => ({ ...prev, [field]: text }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    if (error) setError("");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName) newErrors.firstName = t("errors.requiredField");
    if (!form.lastName) newErrors.lastName = t("errors.requiredField");
    if (!form.email) {
      newErrors.email = t("errors.requiredField");
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = t("errors.invalidEmail");
    }

    if (!form.phone) {
      newErrors.phone = t("errors.requiredField");
    } else if (!/^\+?[0-9]{10,15}$/.test(form.phone)) {
      newErrors.phone = t("errors.invalidPhone");
    }

    if (!form.password) {
      newErrors.password = t("errors.requiredField");
    } else if (form.password.length < 6) {
      newErrors.password = t("errors.invalidPassword");
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = t("errors.requiredField");
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = t("errors.passwordsDoNotMatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    try {
      // Lưu tạm form vào store để dùng lại sau khi verify OTP
      register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      router.push("/auth/verify-otp");
    } catch (e: any) {
      setError(e?.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.theme.background }]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>

          <Text variant="h1" center style={styles.title}>
            {t("common.appName")}
          </Text>

          <Text
            variant="body"
            center
            color={colors.theme.textSecondary}
            style={styles.subtitle}
          >
            {t("auth.register")}
          </Text>

          <View style={styles.formContainer}>
            {error && <ErrorMessage message={error} />}

            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <Input
                  value={form.firstName}
                  onChangeText={onChange("firstName")}
                  placeholder={t("auth.firstName")}
                  leftIcon={
                    <User size={20} color={colors.theme.textSecondary} />
                  }
                  error={errors.firstName}
                />
              </View>

              <View style={styles.nameField}>
                <Input
                  value={form.lastName}
                  onChangeText={onChange("lastName")}
                  placeholder={t("auth.lastName")}
                  leftIcon={
                    <User size={20} color={colors.theme.textSecondary} />
                  }
                  error={errors.lastName}
                />
              </View>
            </View>

            <Input
              value={form.email}
              onChangeText={onChange("email")}
              placeholder={t("auth.email")}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={20} color={colors.theme.textSecondary} />}
              error={errors.email}
            />

            <Input
              value={form.phone}
              onChangeText={onChange("phone")}
              placeholder={t("auth.phone")}
              keyboardType="phone-pad"
              leftIcon={<Phone size={20} color={colors.theme.textSecondary} />}
              error={errors.phone}
            />

            <Input
              value={form.password}
              onChangeText={onChange("password")}
              placeholder={t("auth.password")}
              secureTextEntry
              leftIcon={<Lock size={20} color={colors.theme.textSecondary} />}
              error={errors.password}
            />

            <Input
              value={form.confirmPassword}
              onChangeText={onChange("confirmPassword")}
              placeholder={t("auth.confirmPassword")}
              secureTextEntry
              leftIcon={<Lock size={20} color={colors.theme.textSecondary} />}
              error={errors.confirmPassword}
            />

            <Text
              variant="bodySmall"
              color={colors.theme.textSecondary}
              style={styles.termsText}
            >
              {t("auth.agreeToTerms")}
            </Text>

            <Button
              title={t("auth.register")}
              onPress={handleRegister}
              loading={isLoading}
              style={styles.registerButton}
            />

            <View style={styles.loginContainer}>
              <Text variant="body" color={colors.theme.textSecondary}>
                {t("auth.alreadyHaveAccount")}
              </Text>
              <Link href="/auth/login" asChild>
                <TouchableOpacity style={styles.loginLink}>
                  <Text variant="body" color={colors.primary} weight="600">
                    {t("auth.login")}
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
    marginTop: layout.spacing.xl,
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: layout.spacing.l,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: layout.spacing.m,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    marginBottom: layout.spacing.s,
  },
  subtitle: {
    marginBottom: layout.spacing.l,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameField: {
    width: "48%",
  },
  termsText: {
    textAlign: "center",
    marginVertical: layout.spacing.m,
  },
  registerButton: {
    marginTop: layout.spacing.m,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: layout.spacing.xl,
  },
  loginLink: {
    marginLeft: layout.spacing.xs,
  },
});
