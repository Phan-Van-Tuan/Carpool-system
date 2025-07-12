import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Driver } from "@/types/auth";
import { api } from "@/services/api";
import { clearTokens, setTokens } from "@/services/storage";

interface AuthState {
  isAuthenticated: boolean;
  driver: Driver | null;
  isLoading: boolean;
  error: string | null;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
  updateProfile: (data: Partial<Driver>) => Promise<void>;
  clearError: () => void;
  setUnauthenticated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      driver: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      login: async (phone: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.auth.login(phone, password);
          const { accessToken, refreshToken } = res.data;
          if (accessToken && refreshToken) {
            set({
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            setTokens(accessToken, refreshToken);
            return true;
          } else {
            set({ error: "Sai tài khoản hoặc mật khẩu", isLoading: false });
            return false;
          }
        } catch (error: any) {
          set({ error: "Đăng nhập thất bại", isLoading: false });
          return false;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await api.auth.logout();
        } catch (error) {
          set({ error: "Logout failed", isLoading: false });
        } finally {
          set({
            isAuthenticated: false,
            driver: null,
            isLoading: false,
          });
          await clearTokens();
        }
      },

      getProfile: async () => {
        set({ isLoading: true });
        try {
          const res = await api.driver.getProfile();
          set({
            driver: res.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ error: "Không lấy được thông tin tài xế", isLoading: false });
        }
      },

      updateProfile: async (data: Partial<Driver>) => {
        set({ isLoading: true });
        try {
          const res = await api.driver.updateProfile(data);
          set({ driver: res.data, isLoading: false });
        } catch (error) {
          set({ error: "Cập nhật thất bại", isLoading: false });
        }
      },

      setUnauthenticated: () => {
        set({
          isAuthenticated: false,
          driver: null,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
