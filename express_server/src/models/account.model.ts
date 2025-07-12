import mongoose, { Document, Schema } from "mongoose";

export enum Role {
  RIDER = "rider",
  DRIVER = "driver",
  ADMIN = "admin",
  OWNER = "owner",
}

export enum AStatus {
  PENDING = "pending",
  ACTIVE = "active",
  BLOCKED = "blocked",
}

export interface IAccount extends Document {
  //─────────── Auth ─────────────
  email?: string;
  phone?: string;
  password: string;

  // ───────── Profile ──────────
  firstName: string;
  lastName?: string;
  role?: Role;
  avatar?: string;
  status?: AStatus;
  verified?: {
    email?: boolean;
    phone?: boolean;
    towFA?: boolean;
  };

  // ───────── Activity ─────────────
  rating?: number;
  cancelPercent?: number;
  totalTrips?: number;
}

const AccountSchema: Schema = new Schema(
  {
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, default: Role.RIDER },

    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true },
    avatar: { type: String },
    status: { type: String, default: AStatus.PENDING },
    verified: {
      email: { type: Boolean, default: false },
      phone: { type: Boolean, default: false },
      towFA: { type: Boolean, default: false },
    },

    rating: { type: Number },
    cancelPercent: { type: Number },
    totalTrips: { type: Number },
  },
  { timestamps: true }
);

const _Account = mongoose.model<IAccount>("Account", AccountSchema);
export default _Account;
