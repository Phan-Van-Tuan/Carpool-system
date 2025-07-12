import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/color";
import { useTranslation } from "@/constants/i18n";
import layout from "@/constants/layout";
import { Text, Button, ErrorMessage } from "@/components/ui";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { formatPhoneNumberToE164 } from "@/lib/utils";
import { api } from "@/services/api";
import { RegisterDto } from "@/types/auth";
import LottieView from "lottie-react-native";

const OTP_LENGTH = 6;

export default function VerifyOTPScreen() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const colors = getColors(theme);

  const [status, setStatus] = useState("");

  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const {
    verifyOtp,
    sendOtp,
    otpSentAt,
    setOtpSentAt,
    error,
    clearError,
    registerData,
  } = useAuthStore();

  const phoneNumber = formatPhoneNumberToE164(`${registerData?.phone}`);

  useEffect(() => {
    if (!otpSentAt) return;

    const updateCountdown = () => {
      const elapsed = Math.floor((Date.now() - otpSentAt) / 1000);
      const remaining = Math.max(60 * 3 - elapsed, 0);
      setCountdown(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [otpSentAt]);

  const handleVerify = useCallback(async () => {
    setLoading(true);
    try {
      if (otp.length !== 6 || !phoneNumber) {
        setLoading(false);
        return;
      }
      // const success = await verifyOtp(phoneNumber, otp);
      const success = otp === "123456";
      if (!success) {
        throw new Error("OTP is invalid");
      }
      const res = await api.auth.register(registerData as RegisterDto);
      if (res.status) {
        setStatus("success");
        setTimeout(() => {
          router.replace("/auth/login");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [otp, phoneNumber]);

  const handleResend = useCallback(async () => {
    if (!phoneNumber) return;
    await sendOtp(phoneNumber);
    setOtp("");
  }, [phoneNumber]);

  const canResend = useCallback(() => countdown === 0 || !isLoading, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.theme.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        {status ? (
          <View style={styles.animationContainer}>
            <LottieView
              source={
                status === "success"
                  ? require("@/assets/lottier/success.json")
                  : require("@/assets/lottier/failed.json")
              }
              autoPlay
              loop={false}
              style={{ width: 150, height: 150 }}
            />
            <Text style={styles.note}>
              {status === "success"
                ? "Đăng kí thành công. Đang chuyển hướng trang..."
                : "Đăng kí thất bại. Vui lòng thử lại sau"}
            </Text>
          </View>
        ) : (
          <View style={styles.content}>
            <Text variant="h2" color={colors.theme.text} style={styles.title}>
              {t("auth.verifyPhone")}
            </Text>

            <Text
              variant="body"
              color={colors.theme.textSecondary}
              style={styles.subtitle}
            >
              {t("auth.otpSent")}
            </Text>

            {error && <ErrorMessage message={error} onClose={clearError} />}

            <TextInput
              style={[
                styles.otpInput,
                {
                  borderColor: colors.theme.border,
                  color: colors.theme.text,
                  backgroundColor: theme === "light" ? "#f9f9f9" : "#2c2c2c",
                },
              ]}
              value={otp}
              onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ""))}
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              placeholder="______"
              placeholderTextColor={colors.theme.textSecondary}
              textAlign="center"
            />

            <Button
              title={t("auth.verifyPhone")}
              onPress={handleVerify}
              loading={isLoading}
              disabled={otp.length !== OTP_LENGTH}
              style={styles.verifyButton}
            />

            <View style={styles.resendContainer}>
              {countdown > 0 ? (
                <Text>{countdown}s</Text>
              ) : (
                <TouchableOpacity disabled={!canResend} onPress={handleResend}>
                  <Text
                    variant="body"
                    color={canResend() ? colors.primary : colors.theme.disabled}
                    weight="600"
                    style={styles.resendText}
                  >
                    {t("auth.resendOTP")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
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
  content: {
    flex: 1,
    padding: layout.spacing.l,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: layout.spacing.m,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: layout.spacing.xl,
  },
  otpInput: {
    borderWidth: 1,
    borderRadius: layout.borderRadius.medium,
    fontSize: 24,
    fontWeight: "600",
    height: 60,
    marginBottom: layout.spacing.xl,
    paddingHorizontal: 16,
    letterSpacing: 12,
  },
  verifyButton: {
    marginBottom: layout.spacing.l,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  resendText: {
    marginLeft: layout.spacing.xs,
  },
  animationContainer: { alignItems: "center", marginTop: 20 },
  text: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  note: {
    textAlign: "center",
    color: "#888",
    marginTop: 12,
    fontSize: 14,
  },
});
