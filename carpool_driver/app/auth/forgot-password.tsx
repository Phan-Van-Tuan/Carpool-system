import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mail } from "lucide-react-native";
import Layout from "@/constants/layout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useTheme } from "@/contexts/ThemeContext";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = () => {
    if (!email) {
      setError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = () => {
    if (validateEmail()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
      }, 2000);
    }
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

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
              Reset Password
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {isSubmitted
                ? "We've sent password reset instructions to your email"
                : "Enter your email and we'll send you instructions to reset your password"}
            </Text>
          </View>

          {!isSubmitted ? (
            <View style={styles.form}>
              <Input
                colors={colors}
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Mail size={20} color={colors.gray} />}
                error={error}
              />
              <Button
                colors={colors}
                title="Send Reset Link"
                onPress={handleSubmit}
                isLoading={isLoading}
                style={styles.submitButton}
              />
            </View>
          ) : (
            <View
              style={[
                styles.successContainer,
                { backgroundColor: colors.darkGray },
              ]}
            >
              <Text style={[styles.successText, { color: colors.text }]}>
                Check your email for the reset link. If you don't see it, check
                your spam folder.
              </Text>
            </View>
          )}

          <Button
            colors={colors}
            title="Back to Login"
            variant="outline"
            onPress={handleBackToLogin}
            style={styles.backButton}
          />
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
    marginBottom: Layout.spacing.m,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  form: {
    marginBottom: Layout.spacing.xl,
  },
  submitButton: {
    marginTop: Layout.spacing.l,
  },
  successContainer: {
    padding: Layout.spacing.l,
    borderRadius: Layout.borderRadius.medium,
    marginBottom: Layout.spacing.xl,
  },
  successText: {
    fontSize: 14,
    lineHeight: 20,
  },
  backButton: {
    marginTop: Layout.spacing.m,
  },
});
