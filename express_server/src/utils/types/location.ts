export interface GeoJson {
  type:
    | "Feature"
    | "FeatureCollection"
    | "Point"
    | "LineString"
    | "Polygon"
    | "MultiPoint"
    | "MultiLineString"
    | "MultiPolygon";
  geometry: {
    type: "Point" | "LineString" | "Polygon"; // Các loại hình học phổ biến nhất
    coordinates:
      | [number, number] // Point: [longitude, latitude]
      | [number, number][] // LineString: mảng các điểm
      | [number, number][][]; // Polygon: mảng các vòng (ring)
  };
  properties: {
    name?: string; // Tên địa điểm
    address?: string; // Địa chỉ
    city?: string; // Thành phố
    country?: string; // Quốc gia
    postalCode?: string; // Mã bưu điện
    description?: string; // Mô tả thêm
    icon?: string; // URL hoặc tên icon cho bản đồ
    id?: string | number; // ID duy nhất cho feature
    [key: string]: any; // Cho phép mở rộng thuộc tính tùy chỉnh
  };
}

export type Coordinate = [number, number];

export interface Waypoint {
  location: GeoJson; // Tọa độ: "latitude,longitude"
  type: "pickup" | "dropoff" | "waypoint"; // Loại điểm dừng
  bookingId?: string;
  distanse?: number; // tổng khoảng cách từ start tới điểm này
  duration?: number; // tổng thời gian từ start tới điểm này
}

import { Schema } from "mongoose";
import { z } from "zod";

export const geoJsonSchema = z.object({
  type: z.string(),
  geometry: z.object({
    type: z.enum(["Point", "LineString", "Polygon"]),
    coordinates: z.any(), // hoặc z.array(z.any()) cho đơn giản
  }),
  properties: z.record(z.any()).optional(),
});

// Sub-schema cho geometry
const GeometrySchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Point", "LineString", "Polygon"],
      required: true,
    },
    coordinates: {
      type: Schema.Types.Mixed, // Tùy thuộc vào `type`, có thể là array 2D hoặc 3D
      required: true,
    },
  },
  { _id: false }
);

// Sub-schema cho properties
const PropertiesSchema = new Schema(
  {
    name: String,
    address: String,
    city: String,
    country: String,
    postalCode: String,
    description: String,
    icon: String,
    id: Schema.Types.Mixed,
  },
  { _id: false, strict: false } // Cho phép mở rộng thêm key
);

// Schema chính cho GeoJson
export const GeoJsonSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        "Feature",
        "FeatureCollection",
        "Point",
        "LineString",
        "Polygon",
        "MultiPoint",
        "MultiLineString",
        "MultiPolygon",
      ],
      required: true,
    },
    geometry: {
      type: GeometrySchema,
      required: true,
    },
    properties: {
      type: PropertiesSchema,
      default: {},
    },
  },
  { _id: false }
);
