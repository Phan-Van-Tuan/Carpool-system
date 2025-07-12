import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Trip } from "@/types/trip";
import { api } from "@/services/api";

interface TripState {
  nextTrip: Trip | null;
  activeTrip: Trip | null;
  tripHistory: Trip[];
  isLoading: boolean;
  error: string | null;
  activeTripProgress: number; // Thêm biến này
  fetchTripHistory: () => Promise<void>;
  fetchNextTrip: () => Promise<void>;
  startTrip: (tripId: string) => Promise<void>;
  completeTrip: (tripId: string, note?: string) => Promise<void>;
  resetTrip: () => void;
  getTripDetail: (tripId: string) => Promise<Trip | null>;
  setActiveTripProgress: (progress: number) => void; // Thêm hàm này
  resetActiveTripProgress: () => void; // Thêm hàm này
}

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      nextTrip: null,
      activeTrip: null,
      tripHistory: [],
      isLoading: false,
      error: null,
      activeTripProgress: 0, // Khởi tạo

      fetchNextTrip: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.trips.getNext();
          // console.log("Next trip data:", res.data);
          set({ nextTrip: res.data, isLoading: false });
        } catch (error) {
          set({ error: "Không lấy được trip tiếp theo", isLoading: false });
        }
      },

      fetchTripHistory: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.trips.getHistory();
          // console.log("Trip history data:", res.data);
          set({ tripHistory: res.data, isLoading: false });
        } catch (error) {
          set({ error: "Không lấy được lịch sử trip", isLoading: false });
        }
      },

      startTrip: async (tripId: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.trips.startTrip(tripId);
          console.log("Start trip result:", res.data);
          set({ activeTrip: res.data, nextTrip: null, isLoading: false });
        } catch (error) {
          set({ error: "Không thể bắt đầu trip", isLoading: false });
        }
      },

      completeTrip: async (tripId: string, note?: string) => {
        set({ isLoading: true, error: null });
        try {
          // const res = await api.trips.completeTrip(tripId, note);
          set((state) => ({
            // tripHistory: [res.data, ...state.tripHistory],
            activeTrip: null,
            isLoading: false,
          }));
        } catch (error) {
          set({ error: "Không thể hoàn thành trip", isLoading: false });
        }
      },

      resetTrip: () => set({ activeTrip: null, nextTrip: null }),

      getTripDetail: async (tripId: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.trips.getDetail(tripId);
          set({ isLoading: false });
          return res.data;
        } catch (error) {
          set({ error: "Không lấy được chi tiết trip", isLoading: false });
          return null;
        }
      },

      setActiveTripProgress: (progress: number) =>
        set({ activeTripProgress: progress }),
      resetActiveTripProgress: () => set({ activeTripProgress: 0 }),
    }),
    {
      name: "trip-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        nextTrip: state.nextTrip,
        activeTrip: state.activeTrip,
        tripHistory: state.tripHistory,
        activeTripProgress: state.activeTripProgress, // Lưu vào storage
      }),
    }
  )
);
