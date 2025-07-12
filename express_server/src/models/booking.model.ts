import mongoose, { Document, Schema } from "mongoose";
import { ETransactionMethod, ETranferStatus } from "./transaction.model";
import { GeoJson, GeoJsonSchema } from "../utils/types/location";

export enum EBookingStatus {
  PENDING = "pending",
  CANCELED = "canceled",
  PROCESS = "process",
  ENDING = "ending",
  FINISHED = "finished",
}

export interface IBooking extends Document {
  customerId: mongoose.Types.ObjectId;
  pickup: GeoJson;
  dropoff: GeoJson;
  departure: Date;
  distance: number;
  duration: number;
  passengers: number;
  priceInfo?: string;
  price: number;
  status?: EBookingStatus;
  paymentStatus?: ETranferStatus;
  paymentMethod: ETransactionMethod;
  note?: string;
  rating?: number;
}

const BookingSchema: Schema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    pickup: {
      type: GeoJsonSchema,
      required: true,
    },
    dropoff: {
      type: GeoJsonSchema,
      required: true,
    },
    distance: { type: Number, required: true },
    departure: { type: Date, required: true },
    passengers: { type: Number },
    duration: { type: Number },
    priceInfo: { type: String },
    price: { type: Number, required: true },
    status: { type: String, default: EBookingStatus.PENDING },
    paymentStatus: { type: String, default: ETranferStatus.PENDING },
    paymentMethod: { type: String, required: true },
    note: { type: String },
    rating: { type: Number },
  },
  {
    timestamps: true,
  }
);

const _Booking = mongoose.model<IBooking>("Booking", BookingSchema);
export default _Booking;
