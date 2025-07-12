import { Request, Response } from "express";
import { registerPushToken, sendPushNotification } from "./push.service";
import { success } from "../../utils/configs/res";
import _PushToken from "../../models/push.model";

export const exponentPushToken = async (req: Request, res: Response) => {
  const { token, deviceId, deviceType } = req.body;
  const userId = req.user.id;
  if (!token || !deviceId) {
    return res.status(400).json({ message: "Missing token or deviceId" });
  }
  await registerPushToken({ userId, token, deviceId, deviceType });
  return res.json(success("Push token registered"));
};

export const testSendNotification = async (req: Request, res: Response) => {
  const { userId, title, body, data, image, type } = req.body;

  // Lấy danh sách token
  let tokens: string[] = [];
  if (userId) {
    // Gửi cho 1 user
    const pushTokens = await _PushToken.find({ userId });
    tokens = pushTokens.map((t) => t.token);
  } else {
    // Gửi cho tất cả user
    const pushTokens = await _PushToken.find({});
    tokens = pushTokens.map((t) => t.token);
  }

  if (!tokens.length) {
    return res.status(400).json({ message: "Không tìm thấy push token" });
  }

  // Gửi push notification
  await sendPushNotification({
    tokens,
    title,
    body,
    data,
  });

  return res.json(success(tokens.length));
};
