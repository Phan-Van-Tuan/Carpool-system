import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Booking } from "@/types";
import { GeoJson } from "@/types/base";
import { TripDto } from "@/types/booking";
import { api } from "@/services/api";
import { useNotificationStore } from "./notificationStore";
import { formatDateVi, formatTime } from "@/lib/utils";

interface BookingState {
  pickupLocation: GeoJson | null;
  dropoffLocation: GeoJson | null;
  selectedDate: Date | null;
  signature: string | null;
  passengers: number;
  selectedTrip: TripDto | null;
  availableTrips: TripDto[];
  booking: Booking | null;
  isLoading: boolean;
  error: string | null;

  setPickupLocation: (location: GeoJson) => void;
  setDropoffLocation: (location: GeoJson) => void;
  setSelectedDate: (date: Date) => void;
  setPassengers: (count: number) => void;
  setSelectedTrip: (trip: TripDto) => void;
  setBooking: (booking: Booking) => void;
  fetchAvailableTrips: () => Promise<boolean>;
  confirmBooking: () => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  setError: (msg: string) => void;
  clearError: () => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      pickupLocation: null,
      dropoffLocation: null,
      selectedDate: null,
      passengers: 1,
      signature: null,
      selectedTrip: null,
      availableTrips: [],
      booking: null,
      isLoading: false,
      error: null,

      setPickupLocation: (location) => set({ pickupLocation: location }),
      setDropoffLocation: (location) => set({ dropoffLocation: location }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setPassengers: (count) => set({ passengers: count }),
      setBooking: (booking) => set({ booking }),

      setSelectedTrip: (trip) => {
        const state = get();
        set({
          selectedTrip: trip,
          booking: {
            pickup: state.pickupLocation!,
            dropoff: state.dropoffLocation!,
            departure: new Date(trip.estimatedPickupTime),
            distance: trip.estimatedDistance,
            duration: 0,
            passengers: state.passengers,
            price: trip.estimatedPrice * state.passengers,
            status: "pending",
            paymentStatus: "pending",
            paymentMethod: "cash",
            note: "",
            rating: 5,
          },
        });
      },

      fetchAvailableTrips: async () => {
        const { pickupLocation, dropoffLocation, selectedDate, passengers } =
          get();

        if (
          !pickupLocation ||
          !dropoffLocation ||
          !selectedDate ||
          !passengers
        ) {
          set({
            error: "Vui lòng chọn đầy đủ thông tin trước khi tìm chuyến.",
          });
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await api.booking.match({
            pickup: pickupLocation,
            dropoff: dropoffLocation,
            departure: selectedDate,
            passengers: passengers,
          });
          // console.log("Available trips response:", response.data);

          const trips = response.data.trips;
          set({ availableTrips: trips, isLoading: false });
          return true;
        } catch (error) {
          set({
            error: "Không thể tìm chuyến. Vui lòng thử lại.",
            isLoading: false,
          });
          return false;
        }
      },

      confirmBooking: async () => {
        const booking = get().booking;
        const selectedTrip = get().selectedTrip;

        if (!booking || !selectedTrip) {
          set({ error: "Dữ liệu đặt chuyến không hợp lệ." });
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await api.booking.create(selectedTrip._id, booking);
          set({ booking: null, isLoading: false });

          // Push notification
          useNotificationStore.getState().addNotification({
            id: Date.now().toString(),
            userId: booking.customerId || "me",
            type: "booking",
            title: "Đặt chuyến thành công",
            content: `Bạn đã đặt chuyến thành công. chuyến ${
              booking.pickup.properties.description
            } đến ${
              booking.dropoff.properties.description
            }.Dự kiến vào lúc ${formatTime(
              new Date(booking.departure)
            )} ${formatDateVi(new Date(booking.departure))}.`,
            isRead: false,
            createdAt: new Date(),
          });

          return true;
        } catch (error) {
          set({
            error: "Đặt chuyến thất bại. Vui lòng thử lại.",
            isLoading: false,
          });
          return false;
        }
      },

      cancelBooking: async (bookingId: string) => {
        set({ isLoading: true, error: null });

        try {
          // await api.booking.cancel(bookingId);

          const currentBooking = get().booking;
          if (currentBooking && currentBooking._id === bookingId) {
            set({
              booking: {
                ...currentBooking,
                status: "canceled",
                updatedAt: new Date(),
              },
              isLoading: false,
            });
          }

          return true;
        } catch (error) {
          set({
            error: "Huỷ chuyến thất bại. Vui lòng thử lại.",
            isLoading: false,
          });
          return false;
        }
      },

      setError: (msg) => set({ error: msg }),
      clearError: () => set({ error: null }),

      resetBooking: () => {
        set({
          pickupLocation: null,
          dropoffLocation: null,
          selectedDate: null,
          passengers: 1,
          selectedTrip: null,
          availableTrips: [],
          booking: null,
          error: null,
        });
      },
    }),
    {
      name: "booking-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        pickupLocation: state.pickupLocation,
        dropoffLocation: state.dropoffLocation,
        selectedDate: state.selectedDate,
        passengers: state.passengers,
        booking: state.booking,
      }),
    }
  )
);
