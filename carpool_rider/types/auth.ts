import { User } from ".";

export interface Driver {
  accountId: Account;
  earnings: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
  isOnline?: boolean;
}

export interface Account {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  rating?: number;
  cancelPercent?: number;
  status: "unverified" | "pending" | "active" | "banned";
  aesKey?: string;
  totalTrips: number;
  createdAt: Date;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  password: string;
  avatar?: string;
  aesKey?: string;
}

export interface Auth {
  user: User;
  accessToken: string;
  refreshToken: string;
}
