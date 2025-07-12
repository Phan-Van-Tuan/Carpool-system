import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Trip } from "@/types/trip";
import { useTripStore } from "@/store/trip-store";
import { useSocket } from "@/services/socket";

interface TripContextType {
  nextTrip: Trip | null;
  activeTrip: Trip | null;
  tripHistory: Trip[];
  isLoading: boolean;
  activeTripProgress: number;
  error: string | null;
  startTrip: (tripId: string, bookingIds: string[]) => Promise<void>;
  completeTrip: (note?: string) => Promise<void>;
  refreshTrips: () => Promise<void>;
  sendLocation: (lat: number, lng: number) => void;
  sendEvent: (event: "pause" | "resume" | "arrived" | "completed") => void;
  isConnected: boolean;
  setActiveTripProgress: (progress: number) => void;
  // resetActiveTripProgress: () => void;
  updateTripStatus: (
    bookingId: string,
    status: "ongoing" | "arrived" | "picked" | "dropped",
    bookingIds: string[]
  ) => void;
}

const TripContext = createContext<TripContextType | null>(null);

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) throw new Error("useTrip must be used within a TripProvider");
  return context;
};

export const TripProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTripProgress, setActiveTripProgress] = useState(0);

  const {
    nextTrip,
    activeTrip,
    tripHistory,
    isLoading,
    error,
    fetchNextTrip,
    fetchTripHistory,
    startTrip: startFromStore,
    completeTrip: completeFromStore,
  } = useTripStore();

  const { isConnected, sendLocationUpdate, sendTripData, stopSocket } =
    useSocket(activeTrip?._id);

  const sendLocation = useCallback(
    (lat: number, lng: number) => {
      if (activeTrip && isConnected) {
        sendLocationUpdate({
          tripId: activeTrip._id,
          latitude: lat,
          longitude: lng,
          timestamp: new Date().toISOString(),
        });
      }
    },
    [activeTrip?._id, isConnected, sendLocationUpdate]
  );

  const sendEvent = useCallback(
    (event: "pause" | "resume" | "arrived" | "completed") => {
      if (activeTrip && isConnected) {
        sendTripData("trip:event", {
          tripId: activeTrip._id,
          event,
        });
      }
    },
    [activeTrip?._id, isConnected, sendTripData]
  );

  const startTrip = useCallback(
    async (tripId: string, bookingIds: string[]) => {
      await startFromStore(tripId);
      sendTripData("trip:start", { tripId, bookingIds });
    },
    [startFromStore, sendTripData]
  );

  const completeTrip = useCallback(
    async (note?: string) => {
      if (!activeTrip) return;
      await completeFromStore(activeTrip._id, note);
      sendTripData("trip:complete", { tripId: activeTrip._id });
      stopSocket();
    },
    [activeTrip?._id, completeFromStore, sendTripData]
  );

  const refreshTrips = useCallback(async () => {
    await fetchNextTrip();
    await fetchTripHistory();
  }, [fetchNextTrip, fetchTripHistory]);

  const updateTripStatus = useCallback(
    (
      bookingId: string,
      status: "ongoing" | "arrived" | "picked" | "dropped",
      bookingIds?: string[]
    ) => {
      if (activeTrip && isConnected) {
        sendTripData("trip:status:update", {
          tripId: activeTrip._id,
          status,
          bookingId,
          bookingIds,
        });
      }
    },
    [activeTrip?._id, isConnected, sendTripData]
  );

  const value = useMemo(
    () => ({
      nextTrip,
      activeTrip,
      tripHistory,
      isLoading,
      error,
      startTrip,
      completeTrip,
      refreshTrips,
      sendLocation,
      sendEvent,
      isConnected,
      activeTripProgress,
      setActiveTripProgress,
      // resetActiveTripProgress,
      updateTripStatus,
    }),
    [
      nextTrip,
      activeTrip,
      tripHistory,
      isLoading,
      error,
      startTrip,
      completeTrip,
      refreshTrips,
      sendLocation,
      sendEvent,
      isConnected,
      activeTripProgress,
      setActiveTripProgress,
      // resetActiveTripProgress,
      updateTripStatus,
    ]
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};
