import mongoose, { Document, Schema } from "mongoose";

export interface IRating extends Document {
  bookingId: mongoose.Types.ObjectId;
  revieweeId: mongoose.Types.ObjectId;
  reviewerId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
}

const RatingSchema: Schema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    revieweeId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    reviewerId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IRating>("Rating", RatingSchema);
