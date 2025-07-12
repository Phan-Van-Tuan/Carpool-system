// models/Assignment.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IAssignment extends Document {
  routeId: mongoose.Types.ObjectId;
  driverId: mongoose.Types.ObjectId;
  pattern: "even" | "odd" | "daily" | "custom"; // ngày chẵn/lẻ/hằng ngày/tùy chỉnh
  customDays: string[]; // Nếu pattern = custom: [ngày giờ hoàn chỉnh]
  startDate: Date; // ngày bắt đầu áp dụng
  endDate?: Date; // (tuỳ chọn) ngày kết thúc
  status: "active" | "inactive";
  notes?: string;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    routeId: { type: Schema.Types.ObjectId, ref: "Route", required: true },
    driverId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    pattern: {
      type: String,
      enum: ["even", "odd", "daily", "custom"],
    },
    customDays: [{ type: String }],
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    notes: { type: String },
  },
  { timestamps: true }
);

const _Assignment = mongoose.model<IAssignment>("Assignment", AssignmentSchema);
export default _Assignment;
