import { IBaseResponse } from "@/types/base";
import request, { mapRequest } from "./request";
import { Auth, RegisterDto } from "@/types/auth";
import { env } from "@/constants/env";
import { PlacePrediction } from "@/types/extend";
import { caculateReqDto, calulateResDto } from "@/types/booking";
import { Booking, User } from "@/types";
import { EPayType } from "@/types/transaction";

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = {
  auth: {
    register: async (body: RegisterDto): Promise<IBaseResponse<string>> => {
      return await request.post("/auth/register", {
        ...body,
        role: "rider",
        otpToken: "test-otp-token",
      });
    },
    login: async (
      phone: string,
      password: string
    ): Promise<IBaseResponse<Auth>> => {
      return await request.post("/auth/login", {
        phone,
        password,
        role: "rider",
      });
    },
    logout: async (): Promise<IBaseResponse<boolean>> => {
      return await request.post("/auth/logout");
    },
    getProfile: async (): Promise<IBaseResponse<User>> => {
      return await request.get("/auth/me");
    },
    forgotPassword: async (phone: string) => {
      return await request.post("/auth/password/forgot", { phone });
    },
    resetPassword: async (
      firebaseToken: string,
      newPassword: string,
      isLogoutAll = false
    ) => {
      return await request.post("/auth/password/reset", {
        firebaseToken,
        newPassword,
        isLogoutAll,
      });
    },
    changePassword: async (
      currentPassword: string,
      newPassword: string,
      isLogoutAll = false
    ) => {
      return await request.patch("/auth/password/change", {
        currentPassword,
        newPassword,
        isLogoutAll,
      });
    },
    updateProfile: async (data: any): Promise<IBaseResponse<Auth>> => {
      return await request.put("/auth/update-profile", data);
    },
  },
  map: {
    autoComplete: async (query: string): Promise<PlacePrediction[]> => {
      try {
        const response = await mapRequest.get(
          `/Place/AutoComplete?api_key=${
            env.MAP.KEY
          }&input=${encodeURIComponent(query)}`
        );
        return Promise.resolve(response.data.predictions);
      } catch (e) {
        console.log("error ở đây: ", e);
        return Promise.reject(e);
      }
    },
    getDetail: async (place_id: string): Promise<any> => {
      const response = await mapRequest.get(
        `/Place/Detail?place_id=${place_id}&api_key=${env.MAP.KEY}`
      );
      return Promise.resolve(response.data);
    },
    getByGeocode: async (lat: number, lng: number): Promise<any> => {
      const response = await mapRequest.get(
        `/Geocode?latlng=${lat},${lng}&api_key=${env.MAP.KEY}`
      );
      return Promise.resolve(response.data);
    },
  },
  booking: {
    caculate: async (
      payload: caculateReqDto
    ): Promise<IBaseResponse<calulateResDto>> => {
      return await request.post("/rider/booking/analysis", payload);
    },
    match: async (payload: caculateReqDto): Promise<IBaseResponse<any>> => {
      return await request.post("/rider/booking/matching-trips", payload);
    },
    create: async (
      tripId: string,
      booking: Booking
    ): Promise<IBaseResponse<Booking>> => {
      return await request.post("/rider/booking/create", {
        tripId,
        booking,
      });
    },
    pay: async (
      bookingId: string,
      paymentMethod: string
    ): Promise<IBaseResponse<string>> => {
      return await request.post("rider/payment/create", {
        data: { bookingId },
        paymentMethod,
        paymentType: EPayType.RIDER,
      });
    },
  },
  trip: {
    getAll: async (): Promise<
      IBaseResponse<{
        bookings: Booking[];
        size: number;
        activeTripId: string;
      }>
    > => {
      return await request.get("/rider/bookings");
    },
  },
  site: {
    pushToken: async (
      token: string,
      deviceId: string,
      deviceType: string
    ): Promise<IBaseResponse<any>> => {
      return await request.post("/device/register", {
        token,
        deviceId,
        deviceType,
      });
    },
  },
};
