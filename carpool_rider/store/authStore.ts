import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types";
import { api } from "@/services/api";
import { clearTokens, setTokens } from "@/services/storage";
import { RegisterDto } from "@/types/auth";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { getAuth, signInWithPhoneNumber } from "@react-native-firebase/auth";
import { getApp } from "@react-native-firebase/app";
import { RecaptchaVerifier } from "firebase/auth";

const app = getApp(); // lấy app mặc định
const auth = getAuth(app);

interface AuthState {
  register: (data: RegisterDto) => void;
  clearRegister: () => void;
  registerData: RegisterDto | null;

  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, code: string) => Promise<boolean>;
  confirmationResult: FirebaseAuthTypes.ConfirmationResult | null;
  otpSentAt: number | null;
  setOtpSentAt: (timestamp: number) => void;

  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
  resetPassword: (
    firebaseToken: string,
    newPassword: string
  ) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  setToken: (a: string, r: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      registerData: null,
      otpSentAt: null,
      confirmationResult: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: (data) => set({ registerData: data }),
      clearRegister: () => set({ registerData: null }),
      setOtpSentAt: (timestamp) => set({ otpSentAt: timestamp }),
      sendOtp: async (phone: any) => {
        try {
          set({ isLoading: true });
          console.log(phone);
          const confirmation = await signInWithPhoneNumber(auth, phone);
          set({
            confirmationResult: confirmation,
            otpSentAt: Date.now(),
          });
        } catch (error) {
          console.error("Firebase OTP send failed:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      verifyOtp: async (code) => {
        const confirmation = get().confirmationResult;
        if (!confirmation) {
          console.warn("No confirmation result to verify OTP");
          return false;
        }

        try {
          set({ isLoading: true });
          await confirmation.confirm(code);
          return true;
        } catch (error) {
          console.error("Firebase OTP verify failed:", error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (phone: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.auth.login(phone, password);
          const { user, accessToken, refreshToken } = res.data;
          // Lưu token ra ngoài AsyncStorage
          await setTokens(accessToken, refreshToken);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error: any) {
          set({
            error:
              error?.response?.data?.message ||
              "Đăng nhập thất bại. Vui lòng thử lại.",
            isLoading: false,
          });
          return false;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await api.auth.logout();
        } catch (error) {
          console.log(error);
        } finally {
          await clearTokens();

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      getProfile: async () => {
        set({ isLoading: true });
        try {
          const res = await api.auth.getProfile();
          set({ user: res.data, isLoading: false });
        } catch (error) {
          // set({ error: "Get profile failed", isLoading: false });
        }
      },

      resetPassword: async (firebaseToken: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          await api.auth.resetPassword(firebaseToken, newPassword);
          set({ isLoading: false });
          return true;
        } catch (error) {
          set({ error: "Password reset failed", isLoading: false });
          return false;
        }
      },

      updateUser: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.auth.updateProfile(userData);
          set({ user: res.data.user, isLoading: false });
        } catch (error) {
          set({ error: "Failed to update user profile", isLoading: false });
        }
      },

      setToken: async (accessToken: string, refreshToken: string) => {
        await setTokens(accessToken, refreshToken);
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);
