import { GeoJson } from "./base";

export type TripStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Booking {
  _id: string;
  customerId: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
    rating?: number;
  };
  pickup: GeoJson;
  dropoff: GeoJson;
  price: number;
  status: string;
  distance: number;
  duration: number;
  departure: string;
  passengers: number;
  note?: string;
  rating?: number;
}

export interface Trip {
  _id: string;
  driverId: string;
  vehicleId: string;
  bookings: Booking[];
  routeId?: string;
  assignmentId?: string;
  startLocation: GeoJson;
  endLocation: GeoJson;
  waypoints: {
    location: GeoJson;
    type: "pickup" | "dropoff" | "waypoint";
    bookingId?: string;
  }[];
  distance: number;
  duration: number;
  departure: string;
  status: TripStatus;
}
