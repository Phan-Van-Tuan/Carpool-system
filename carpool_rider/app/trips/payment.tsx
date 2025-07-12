import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  BackHandler,
} from "react-native";
import { WebView } from "react-native-webview";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";

const PaymentScreen = () => {
  const router = useRouter();
  const { paymentUrl } = useLocalSearchParams<{ paymentUrl?: string }>();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"success" | "failed" | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    console.log("paymentUrl:", paymentUrl);
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.replace("/(tabs)/trips");
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);

  // Hàm kiểm tra trạng thái thanh toán dựa trên url trả về từ cổng thanh toán
  const handleNavigationStateChange = (navState: any) => {
    const url = navState?.url;
    if (!url || typeof url !== "string") return;

    console.log("Navigation state change:", url);

    try {
      const parsedUrl = new URL(url);
      const params = new URLSearchParams(parsedUrl.search);

      const vnpCode = params.get("vnp_ResponseCode");
      const momoError = params.get("errorCode");
      const paymentResult = params.get("paymentResult");

      // ✅ VNPay thành công
      if (vnpCode === "00") {
        setStatus("success");
        setMessage("Thanh toán VNPay thành công!");
      }
      // ✅ MoMo thành công
      else if (momoError === "0") {
        setStatus("success");
        setMessage("Thanh toán MoMo thành công!");
      }
      // ❌ Thất bại (MoMo hoặc VNPay)
      else if (paymentResult === "fail" || vnpCode || momoError) {
        setStatus("failed");
        setMessage("Thanh toán thất bại!");
      } else {
        return; // Không rõ kết quả, bỏ qua
      }

      setTimeout(() => {
        router.replace("/(tabs)/trips");
      }, 1000);
    } catch (error) {
      console.error("Lỗi khi phân tích URL:", error);
    }
  };

  if (!paymentUrl) {
    setTimeout(() => {
      router.replace("/(tabs)/trips");
    }, 1000);
    return <Text>Không có URL thanh toán. Vui lòng thử lại sau.</Text>;
  }

  return (
    <View style={styles.container}>
      {loading && !status && <ActivityIndicator size="large" color="#00bfa5" />}
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
          <Text style={styles.text}>{message}</Text>
          <Text style={styles.note}>Đang chuyển hướng trang...</Text>
        </View>
      ) : (
        <WebView
          source={{ uri: paymentUrl }}
          onLoad={() => setLoading(false)}
          onNavigationStateChange={handleNavigationStateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  animationContainer: { alignItems: "center", marginTop: 20 },
  text: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  note: {
    textAlign: "center",
    color: "#888",
    marginTop: 12,
    fontSize: 14,
  },
});

export default PaymentScreen;
