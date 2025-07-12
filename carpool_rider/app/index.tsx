import { useEffect } from "react";
import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { View, StyleSheet, Text } from "react-native";
import { Spinner } from "@/components/ui";
import {
  registerPushNotification,
  setupNotificationListeners,
} from "@/services/notify";
import ErrorBoundary from "./error-boundary";

export default function Index() {
  const { isAuthenticated, isLoading, user, getProfile } = useAuthStore();

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (user?._id) {
      setupNotificationListeners();
      registerPushNotification(user._id);
      console.log("[SETUP] lắng nghe thông báo!");
    } else {
      console.log("[SETUP] Chưa có _id!");
    }
  }, [user?._id]);

  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Spinner size="large" text="Loading..." />
      </View>
    );
  }

  if (!user) {
    return (
      <ErrorBoundary>
        <View style={styles.container}>
          <Text style={styles.errorText}>
            Không thể tải dữ liệu người dùng.
          </Text>
        </View>
      </ErrorBoundary>
    );
  }

  // Kiểm tra status của user
  if (user.status === "blocked") {
    return (
      <ErrorBoundary>
        <View style={styles.container}>
          <Text style={styles.errorText}>Tài khoản của bạn đã bị khóa.</Text>
        </View>
      </ErrorBoundary>
    );
  }

  if (user.status === "pending") {
    return (
      <ErrorBoundary>
        <View style={styles.container}>
          <Text style={styles.errorText}>
            Tài khoản của bạn chưa được xác minh.
          </Text>
        </View>
      </ErrorBoundary>
    );
  }

  if (user.status == "active") {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Text style={styles.errorText}>Đã xảy ra lỗi</Text>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
