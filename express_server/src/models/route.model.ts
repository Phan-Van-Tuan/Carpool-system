// models/Route.ts
import mongoose, { Document, Schema } from "mongoose";
import { GeoJson, GeoJsonSchema } from "../utils/types/location";

export interface IRoute extends Document {
  name: string; // Ví dụ: Hà Nội - Hải Phòng
  from: GeoJson;
  to: GeoJson;
  router: GeoJson;
  distance?: number;
  duration?: number;
  notes?: string;
}

const RouteSchema = new Schema<IRoute>(
  {
    name: { type: String, required: true },
    from: {
      type: GeoJsonSchema,
      required: true,
    },

    to: {
      type: GeoJsonSchema,
      required: true,
    },
    router: {
      type: GeoJsonSchema,
    },
    distance: { type: Number },
    duration: { type: Number },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

const _Route = mongoose.model<IRoute>("Route", RouteSchema);
export default _Route;
