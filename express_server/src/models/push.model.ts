import mongoose, { Document, Schema } from "mongoose";

export interface IPushToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  deviceId: string;
  deviceType?: "android" | "ios" | "web";
  status?: "active" | "inactive";
}

const PushTokenSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    deviceId: { type: String, required: true },
    deviceType: { type: String, enum: ["android", "ios", "web"] },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

// Unique index để đảm bảo mỗi user-device chỉ có 1 token
PushTokenSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

const _PushToken = mongoose.model<IPushToken>("PushToken", PushTokenSchema);
export default _PushToken;
