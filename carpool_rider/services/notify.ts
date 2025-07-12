import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { api } from "./api";

const TOKEN_INFO_KEY = "push_token_info";

type TokenInfo = {
  token: string;
  userId: string;
};

function getDeviceType(): "iOS" | "android" {
  return Constants.platform?.ios ? "iOS" : "android";
}

async function getOrCreateDeviceId(): Promise<string> {
  // Implement your own device ID generation strategy
  // Use SecureStore to persist it if needed
  const key = "device_id";
  let id = await SecureStore.getItemAsync(key);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
    await SecureStore.setItemAsync(key, id);
  }
  return id;
}

async function uploadTokenToServer(
  token: string,
  deviceId: string,
  userId: string
) {
  try {
    await api.site.pushToken(token, deviceId, getDeviceType());
  } catch (error) {
    console.log(error);
  }
}

/**
 * Đăng ký push notification và gửi token lên server nếu cần
 * @param userId ID người dùng
 * @param force Nếu true, luôn đăng ký lại token (ví dụ: khi login)
 */
export async function registerPushNotification(
  userId: string,
  force: boolean = false
): Promise<void> {
  try {
    if (!Device.isDevice) {
      console.warn("⚠️ Notifications chỉ hoạt động trên thiết bị thật");
      return;
    }

    // 1. Check quyền
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("🛑 Không có quyền nhận thông báo");
      return;
    }

    // 2. Kiểm tra local đã lưu token + userId chưa
    const saved = await SecureStore.getItemAsync(TOKEN_INFO_KEY);
    const savedInfo: TokenInfo | null = saved ? JSON.parse(saved) : null;

    // Nếu token đã lưu cho user này và không yêu cầu cập nhật → bỏ qua
    if (!force && savedInfo?.token && savedInfo.userId === userId) {
      console.log("✅ Token đã đăng ký cho user hiện tại");
      return;
    }

    // 3. Lấy token mới
    const tokenResponse = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });
    const expoPushToken = tokenResponse.data;
    const deviceId = await getOrCreateDeviceId();

    // 4. Gửi lên server
    await uploadTokenToServer(expoPushToken, deviceId, userId);

    // 5. Lưu local
    const tokenInfo: TokenInfo = { token: expoPushToken, userId };
    await SecureStore.setItemAsync(TOKEN_INFO_KEY, JSON.stringify(tokenInfo));
    console.log("📲 Token đã đăng ký và lưu local:", tokenInfo);
  } catch (error) {
    console.error("❌ Lỗi khi đăng ký push token:", error);
  }
}

export async function clearPushTokenInfo(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_INFO_KEY);
}

// Lắng nghe và xử lý notification foreground
export function setupNotificationListeners() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  // Khi nhận thông báo lúc app đang mở
  Notifications.addNotificationReceivedListener((notification) => {
    console.log("📩 Notification received (foreground):", notification);
    // TODO: xử lý hiển thị thông báo hoặc logic tại đây
  });

  // Khi người dùng tap vào notification
  Notifications.addNotificationResponseReceivedListener((response) => {
    console.log("➡️ User tapped notification:", response);
    // TODO: xử lý điều hướng dựa trên data
  });
}
