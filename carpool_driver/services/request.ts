import axios, { AxiosError, AxiosResponse } from "axios";
import env from "@/constants/env";
import { jwtDecode } from "jwt-decode";
import { router } from "expo-router";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./storage";

const axiosRequest = axios.create({
  baseURL: env.SERVER.API,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export const mapRequest = axios.create({
  baseURL: env.MAP.URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor cho request
axiosRequest.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      console.log("Token không tồn tại");
    } else if (!token || isTokenExpired(token)) {
      console.log("Token hết hạn");
      const newToken = await refresh(refreshToken);
      config.headers["Authorization"] = `Bearer ${newToken}`;
    } else {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

async function refresh(refreshToken: string) {
  try {
    const response = await axios
      .create({
        baseURL: env.SERVER.API,
        headers: { "Content-Type": "application/json" },
        timeout: 5000,
      })
      .post("/auth/refresh", {
        refreshToken,
      });
    const newAccessToken = response.data.data.accessToken;
    const newRefreshToken = response.data.data.refreshToken;
    await setTokens(newAccessToken, newRefreshToken);
    return newAccessToken;
  } catch (error) {
    await clearTokens();
    throw error;
  }
}

axiosRequest.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      router.replace("/auth/login");
    }
    return Promise.reject(error);
  }
);

export default axiosRequest;

interface JWTPayload {
  exp: number;
  [key: string]: any;
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded: JWTPayload = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
}
