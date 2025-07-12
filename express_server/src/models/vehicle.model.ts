import mongoose, { Document, Schema } from "mongoose";

type VehicleType = "standard" | "vip" | "limousine" | "minibus";

export interface IVehicle extends Document {
  driverId: mongoose.Types.ObjectId;
  type: VehicleType;
  make: string;
  vehicleModel: string;
  color: string;
  year?: number;
  images?: string[];
  licensePlate: string;
  seats: number;
}

const VehicleSchema: Schema = new Schema(
  {
    driverId: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
    type: { type: String, required: true },
    make: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    color: { type: String, required: true },
    year: { type: Number },
    images: [{ type: String }],
    licensePlate: { type: String, required: true },
    seats: { type: Number, required: true },
  },
  { timestamps: true }
);

const _Vehicle = mongoose.model<IVehicle>("Vehicle", VehicleSchema);
export default _Vehicle;
