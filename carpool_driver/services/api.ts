import request from "./request";
import { Driver, registerReqDto } from "@/types/auth";
import { Trip } from "@/types/trip";
import { IBaseResponse } from "@/types/base";
import { mockDriver } from "@/mocks/driver";
import { delay } from "@/utils/dev";

// Simulate API errorss
class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = {
  auth: {
    register: async (body: registerReqDto): Promise<IBaseResponse<any>> => {
      return await request.post("/driver/register", body);
    },
    login: async (
      phone: string,
      password: string
    ): Promise<IBaseResponse<any>> => {
      return await request.post("/auth/login", {
        phone,
        password,
        role: "driver",
      });
    },
    logout: async () => {
      return await request.post("/auth/logout");
    },
  },
  driver: {
    getProfile: async (): Promise<IBaseResponse<Driver>> => {
      return await request.get("/driver/me");
    },
    updateProfile: async (data: Partial<Driver>) => {
      return await request.patch("/driver/update", data);
    },
    updateStatus: async (isOnline: boolean) => {
      // Simulate API call
      await delay(500);
      return { ...mockDriver, isOnline };
    },
    getEarnings: async () => {
      // Simulate API call
      await delay(1200);
      return {
        daily: [
          { date: "2023-06-15", amount: 450000, trips: 6 },
          { date: "2023-06-14", amount: 520000, trips: 7 },
          { date: "2023-06-13", amount: 380000, trips: 5 },
          { date: "2023-06-12", amount: 490000, trips: 6 },
          { date: "2023-06-11", amount: 610000, trips: 8 },
          { date: "2023-06-10", amount: 350000, trips: 4 },
          { date: "2023-06-09", amount: 400000, trips: 5 },
        ],
        weekly: [
          { date: "2023-06-12 - 2023-06-18", amount: 3200000, trips: 42 },
          { date: "2023-06-05 - 2023-06-11", amount: 2950000, trips: 38 },
          { date: "2023-05-29 - 2023-06-04", amount: 3100000, trips: 40 },
          { date: "2023-05-22 - 2023-05-28", amount: 3250000, trips: 43 },
        ],
        monthly: [
          { date: "2023-06", amount: 12500000, trips: 165 },
          { date: "2023-05", amount: 13200000, trips: 172 },
          { date: "2023-04", amount: 11800000, trips: 155 },
          { date: "2023-03", amount: 12300000, trips: 160 },
        ],
      };
    },
  },
  trips: {
    // Lấy trip sắp tới được phân công cho tài xế
    getNext: async (): Promise<IBaseResponse<Trip | null>> => {
      return await request.get("/driver/trip/upcoming");
    },
    // Lấy lịch sử trip đã hoàn thành
    getHistory: async (): Promise<IBaseResponse<Trip[]>> => {
      return await request.get(`/driver/history`);
    },
    // Bắt đầu trip
    startTrip: async (tripId: string): Promise<IBaseResponse<Trip>> => {
      return await request.post(`/driver/trip/${tripId}/start`);
    },
    // Hoàn thành trip
    completeTrip: async (
      tripId: string,
      note?: string
    ): Promise<IBaseResponse<Trip>> => {
      return await request.post(`/driver/trip/${tripId}/finish`, { note });
    },
    // Lấy chi tiết trip
    getDetail: async (tripId: string): Promise<IBaseResponse<Trip>> => {
      return await request.get(`/driver/trip/${tripId}`);
    },
  },
};
