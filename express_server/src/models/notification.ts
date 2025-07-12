import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  type: string;
  title: string;
  content: string;
  image: string;
}

const NotificationSchema: Schema = new Schema(
  {
    type: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
