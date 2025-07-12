import { Booking, Vehicle } from ".";
import { Driver } from "./auth";
import { GeoJson } from "./base";

export interface caculateReqDto {
  pickup: GeoJson;
  dropoff: GeoJson;
  departure: Date;
  passengers: number;
}

export interface calulateResDto {
  pickup: GeoJson;
  dropoff: GeoJson;
  departure: Date;
  passengers: number;
  distance: number;
  duration: number;
  priceInfo: string;
  price: number;
  signature: string;
}

export interface ICurrentResponse {
  currentBooking: Booking[];
  recentBooking: Booking;
}
export interface IGetHistoryResponse {
  bookings: Booking[];
  size: number;
}

export interface IPaymentRequest {
  bookingId: string;
  paymentMethod: string;
}

export enum EBookingStatus {
  PENDING = "pending",
  MATCHED = "matched",
  CANCELED = "canceled",
  PROCESS = "process",
  ENDING = "ending",
  FINISHED = "finished",
}

export const EBookingStatusLabel: Record<string, string> = {
  [EBookingStatus.PENDING]: "Đang chờ ghép tuyến",
  [EBookingStatus.MATCHED]: "Đã ghép chuyến",
  [EBookingStatus.CANCELED]: "Đã hủy",
  [EBookingStatus.PROCESS]: "Đang xử lý",
  [EBookingStatus.ENDING]: "Sắp kết thúc",
  [EBookingStatus.FINISHED]: "Hoàn thành",
};

export interface TripDto {
  _id: string;
  assignmentId: string;
  availableSeats: number;
  bookings: any[];
  createdAt: string; // ISO date string
  departure: string;
  distance: number;
  driverId: Driver;
  duration: number;
  endLocation: GeoJson;
  estimatedDistance: number;
  estimatedDropoffTime: Date;
  estimatedPickupTime: Date;
  estimatedPrice: number;
  history: string;
  routeId: string;
  startLocation: GeoJson;
  status: string;
  tripId: string;
  updatedAt: string;
  vehicleId: Vehicle;
  waypoints: GeoJson[];
}

export interface TripSearchResponse {
  input: {
    departureDate: string;
    dropoff: GeoJson;
    pickup: GeoJson;
    passengerCount: number;
  };
  size: number;
  trips: TripDto[];
}
