import { GeoJson } from "./base";
import { EPayMethod } from "./transaction";

// Theme types
export type ThemeType = "light" | "dark";
export type Language = "en" | "vi" | "zh";

// User related types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "rider" | "driver" | "admin";
  rating: number;
  cancelPercent: number;
  status: "unverified" | "pending" | "active" | "blocked";
  aesKey?: string;
  totalTrips: number;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Driver related types
export interface Driver {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rating?: number;
  cancelPercent: number;
  avatar?: string;
  vehicle?: Vehicle;
  createdAt?: Date;
}

// Trip related types
export interface Trip {
  _id: string;
  startLocation: string;
  endLocation: string;
  waypoints: string[];
  distance: number;
  duration: number;
  departureTime: Date;
  arrivalTime: Date;
  availableSeats: number;
  price: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
  driver?: Driver;
  vehicle?: Vehicle;
  bookings?: Booking[];
}

// Vehicle related types
export type VehicleType = "standard" | "vip" | "limousine" | "minibus";

export interface Vehicle {
  _id: string; // MongoDB ObjectId as string
  driverId: string; // or Driver if you populate
  type: VehicleType;
  make: string;
  vehicleModel: string;
  color: string;
  year?: number;
  images?: string[];
  licensePlate: string;
  seats: number;
  createdAt?: string;
  updatedAt?: string;
}

// Booking related types

export interface Booking {
  _id?: string;
  customerId?: string;
  pickup: GeoJson;
  dropoff: GeoJson;
  departure: Date;
  distance: number;
  duration: number;
  passengers: number;
  price: number;
  status?: "pending" | "canceled" | "process" | "ending" | "finished";
  paymentStatus?: "pending" | "success" | "fail";
  paymentMethod?: EPayMethod | string;
  note?: string;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
  driver?: Driver;
}

// Payment related types
export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  method: "cash" | "card" | "wallet";
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  transactionInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Rating related types
export interface Rating {
  id: string;
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Notification related types
export interface Notification {
  id: string;
  userId: string;
  type: "booking" | "payment" | "trip" | "system" | "promotion";
  title: string;
  content: string;
  isRead: boolean;
  image?: string;
  data?: any;
  createdAt: Date;
}

// Help related types
export interface HelpItem {
  id: string;
  userId?: string;
  category: "account" | "booking" | "payment" | "driver" | "other";
  issue: string;
  content: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  images?: string[];
  createdAt: Date;
  updatedAt?: Date;
}

// Payment method types
export interface PaymentMethod {
  id: string;
  userId: string;
  type: "card" | "bank" | "wallet";
  name: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Saved location types
export interface SavedLocation {
  id: string;
  userId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: "home" | "work" | "favorite" | "other";
  createdAt: Date;
  updatedAt: Date;
}
