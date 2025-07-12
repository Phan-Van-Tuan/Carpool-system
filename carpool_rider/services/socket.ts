// hooks/useTripSocket.ts
import { useEffect, useState, useRef, useCallback } from "react";
import { Platform } from "react-native";
import { io, Socket } from "socket.io-client";
import * as Location from "expo-location";
import { env } from "@/constants/env";
import { getAccessToken } from "./storage";
import { useTripStore } from "@/store/tripStore";

const SOCKET_URL = env.SERVER.SOCKET;

let socket: Socket | null = null;

export type LocationPayload = {
  socketId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
};

export const useTripSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [tripId, setTripId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [driverLocation, setDriverLocation] = useState<LocationPayload | null>(
    null
  );
  const locationInterval = useRef<NodeJS.Timeout | null>(null);
  const [bookingStatus, setBookingStatus] = useState<{
    bookingId: string;
    status: "ongoing" | "arrived" | "picked" | "dropped";
    timestamp: string;
  } | null>(null);

  const { activeTrips } = useTripStore();

  useEffect(() => {
    getAccessToken().then(setAccessToken);
  }, []);

  useEffect(() => {
    if (accessToken) {
      connectSocket();
    }

    return () => {
      stopLocationUpdates();
      disconnectSocket();
    };
  }, [accessToken]);

  const connectSocket = () => {
    if (socket) return;

    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token: accessToken },
    });

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("✅ Trip socket connected");
      if (tripId) {
        socket?.emit("trip:join", { tripId });
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Trip socket disconnected");
      setIsConnected(false);
      stopLocationUpdates();
    });

    socket.on("connect_error", (err: any) => {
      console.log("🚫 Socket error:", err.message);
    });

    socket.on("share:location:driver", (data: LocationPayload) => {
      setDriverLocation(data);
    });

    // Nhận vị trí tài xế
    socket.on(
      "trip:started:signal",
      (data: { tripId: string; bookingIds: string[]; timestamp: string }) => {
        const updatedTrips = activeTrips.map((trip) => {
          if (data.bookingIds.includes(trip._id as string)) {
            setBookingStatus({
              status: "ongoing",
              timestamp: data.timestamp,
              bookingId: trip._id as string,
            });
          }
          return trip;
        });
      }
    );

    // Ví dụ: nhận trạng thái mới của booking (server cần phát sự kiện này)
    socket.on("booking:status:update", (statusData: any) => {
      console.log("📦 Booking status update:", statusData);
      setBookingStatus(statusData);
    });
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };

  const joinTrip = (newTripId: string) => {
    setTripId(newTripId);
    socket?.emit("trip:join", { tripId: newTripId });
  };

  const sendLocationUpdate = useCallback((payload: LocationPayload) => {
    if (socket && socket.connected) {
      socket.emit("location:update", payload);
    }
  }, []);

  const startLocationUpdates = () => {
    if (locationInterval.current) clearInterval(locationInterval.current);

    locationInterval.current = setInterval(async () => {
      if (!socket || !socket.connected || !tripId) return;

      try {
        let location;
        if (Platform.OS === "web") {
          location = {
            coords: {
              latitude: 10.7769 + (Math.random() - 0.5) * 0.001,
              longitude: 106.7009 + (Math.random() - 0.5) * 0.001,
            },
            timestamp: Date.now(),
          };
        } else {
          location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
        }

        const payload: LocationPayload = {
          socketId: socket.id as string,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: new Date().toISOString(),
        };

        sendLocationUpdate(payload);
      } catch (err) {
        console.warn("❌ Failed to get/send location:", err);
      }
    }, 10000); // Cập nhật mỗi 10s (có thể tăng lên với rider)
  };

  const stopLocationUpdates = () => {
    if (locationInterval.current) {
      clearInterval(locationInterval.current);
      locationInterval.current = null;
    }
  };

  return {
    isConnected,
    driverLocation,
    bookingStatus,
    joinTrip,
    sendLocationUpdate,
    startLocationUpdates,
    stopLocationUpdates,
  };
};
