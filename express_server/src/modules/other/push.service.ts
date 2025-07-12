import { Expo } from "expo-server-sdk";
import mongoose from "mongoose";
import _PushToken from "../../models/push.model";

const expo = new Expo();

export async function registerPushToken({
  userId,
  token,
  deviceId,
  deviceType,
}: {
  userId: string | mongoose.Types.ObjectId;
  token: string;
  deviceId: string;
  deviceType?: "android" | "ios" | "web";
}) {
  // Cập nhật hoặc tạo mới
  await _PushToken.findOneAndUpdate(
    { userId, deviceId },
    { token, deviceType },
    { upsert: true, new: true }
  );
}

export async function sendPushNotification({
  tokens,
  title,
  body,
  data,
}: {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, any>;
}) {
  const messages = tokens
    .filter((token) => Expo.isExpoPushToken(token))
    .map((token) => ({
      to: token,
      sound: "default",
      title,
      body,
      data,
    }));

  if (messages.length === 0) {
    console.warn("🟡 Không có token hợp lệ để gửi");
    return;
  }

  try {
    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }
    console.log("✅ Push sent:", messages.length);
  } catch (err) {
    console.error("❌ Lỗi khi gửi push:", err);
  }
}

