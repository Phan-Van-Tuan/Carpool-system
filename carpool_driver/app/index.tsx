import { useEffect, useState } from "react";
import { Redirect, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useAuthStore } from "@/store/auth-store";
import { getAccessToken } from "@/services/storage";

export default function Index() {
  const { isAuthenticated, isLoading, driver, getProfile, setUnauthenticated } =
    useAuthStore();
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const token = await getAccessToken();
      if (!token) {
        setUnauthenticated();
      } else {
        try {
          await getProfile();
        } catch {
          setUnauthenticated();
        }
      }
      setChecking(false);
    })();
  }, []);

  if (checking || isLoading || isAuthenticated === undefined) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  if (driver?.account.status === "pending") {
    return (
      <View style={styles.container}>
        <Text
          style={{
            color: "yellow",
            textAlign: "center",
          }}
        >
          Tài khoản của bạn đang chờ phê duyệt
        </Text>
        <Text
          style={{
            color: "yellow",
            textAlign: "center",
          }}
        >
          Vui lòng thử lại sau
        </Text>
        <TouchableOpacity onPress={() => router.replace("/auth/login")}>
          <Text
            style={{
              color: "blue",
              textAlign: "center",
            }}
          >
            Quay lại
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (driver?.account.status === "blocked") {
    return (
      <View style={styles.container}>
        <Text style={{ color: "red" }}>
          Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.
        </Text>
        <TouchableOpacity onPress={() => router.replace("/auth/login")}>
          <Text
            style={{
              color: "blue",
              textAlign: "center",
            }}
          >
            Quay lại
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
