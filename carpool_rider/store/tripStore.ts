import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Booking } from "@/types";
import { api } from "@/services/api";

interface TripState {
  activeTrips: Booking[];
  pastTrips: Booking[];
  currentTrip: Booking | null;
  currentTripIdRoom: string | null;
  selectedTrip: Booking | null;
  isLoading: boolean;
  error: string | null;

  fetchTrips: () => Promise<void>;
  pushTrips: (trips: Booking[]) => void;
  getTrip: (id: string) => Promise<void>;
  rateTrip: (
    tripId: string,
    rating: number,
    comment?: string
  ) => Promise<boolean>;
  clearTrip: () => void;
  clearError: () => void;
}

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      activeTrips: [],
      pastTrips: [],
      currentTrip: null,
      currentTripIdRoom: null,
      selectedTrip: null,
      isLoading: false,
      error: null,

      fetchTrips: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = (await api.trip.getAll()).data;
          const trips = res.bookings;
          const current = trips.find((trip) => trip.status === "process");

          const past = trips.filter(
            (trip) => trip.status === "finished" || trip.status === "canceled"
          );

          const active = trips.filter(
            (trip) => !past.some((p) => p._id === trip._id)
          );

          set({
            currentTrip: current || null,
            currentTripIdRoom: res.activeTripId,
            activeTrips: active,
            pastTrips: past,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: "Failed to fetch trips",
            isLoading: false,
          });
        }
      },

      pushTrips: (newTrips: Booking[]) => {
        const current = newTrips.find((trip) => trip.status === "process");

        const past = newTrips.filter(
          (trip) => trip.status === "finished" || trip.status === "canceled"
        );

        const pastMap = new Map(get().pastTrips.map((t) => [t._id, t]));
        past.forEach((t) => pastMap.set(t._id, t));

        const currentTrip = current || get().currentTrip;

        const currentActiveIds = new Set(get().activeTrips.map((t) => t._id));
        const incomingActive = newTrips.filter(
          (trip) => !pastMap.has(trip._id)
        );
        const mergedActive = [...get().activeTrips];

        for (const trip of incomingActive) {
          if (!currentActiveIds.has(trip._id)) {
            mergedActive.push(trip);
          }
        }

        set({
          currentTrip,
          activeTrips: mergedActive,
          pastTrips: Array.from(pastMap.values()),
        });
      },

      getTrip: async (_id: string) => {
        set({ isLoading: true, error: null });
        try {
          const allTrips = [...get().activeTrips, ...get().pastTrips];
          const trip = allTrips.find((t) => t._id === _id);

          if (trip) {
            set({ selectedTrip: trip, isLoading: false });
          } else {
            set({
              error: "Trip not found",
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: "Failed to fetch trip details",
            isLoading: false,
          });
        }
      },

      rateTrip: async (tripId: string, rating: number, comment?: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set({ isLoading: false });
          return true;
        } catch (error) {
          set({
            error: "Failed to submit rating",
            isLoading: false,
          });
          return false;
        }
      },

      clearTrip: () =>
        set({
          activeTrips: [],
          pastTrips: [],
          currentTrip: null,
          currentTripIdRoom: null,
          selectedTrip: null,
          isLoading: false,
          error: null,
        }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "trip-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedTrip: null,
      }),
    }
  )
);
