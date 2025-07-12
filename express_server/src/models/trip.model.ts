import mongoose, { Document, Schema } from "mongoose";
import { GeoJson, Waypoint } from "../utils/types/location";

export type TripStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface ITrip extends Document {
  driverId: mongoose.Types.ObjectId;
  vehicleId: mongoose.Types.ObjectId;
  bookings: mongoose.Types.ObjectId[];
  routeId?: mongoose.Types.ObjectId;
  assignmentId?: mongoose.Types.ObjectId;
  startLocation: GeoJson;
  endLocation: GeoJson;
  waypoints: Waypoint[];
  distance: number;
  duration: number;
  departure: Date;
  history: string;
  status: string;
}

const TripSchema: Schema = new Schema(
  {
    driverId: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
    routeId: { type: Schema.Types.ObjectId, ref: "Route" },
    assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment" },

    startLocation: { type: Object, required: true }, // GeoJson
    endLocation: { type: Object, required: true }, // GeoJson
    waypoints: [{ type: Object }], // Waypoint[]
    distance: { type: Number },
    duration: { type: Number },
    departure: { type: Date },
    history: { type: String },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

const _Trip = mongoose.model<ITrip>("Trip", TripSchema);
export default _Trip;
