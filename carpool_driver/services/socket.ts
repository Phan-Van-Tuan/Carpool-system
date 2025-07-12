import { useEffect, useState, useRef, useCallback } from "react";
import { Platform } from "react-native";
import * as Location from "expo-location";
import { io, Socket } from "socket.io-client";
import { getAccessToken } from "./storage";
import env from "@/constants/env";

const SOCKET_URL = env.SERVER.SOCKET;

let socket: Socket | null = null;

export type LocationPayload = {
  tripId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
};

export const useSocket = (tripId?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const locationInterval = useRef<NodeJS.Timeout | null>(null);

  // Lấy token khi mount
  useEffect(() => {
    getAccessToken().then(setAccessToken);
  }, []);

  useEffect(() => {
    requestPermission();
    return () => {
      stopLocationUpdates();
      disconnectSocket();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (tripId && accessToken && locationPermission) {
      startSocket();
    }
    // eslint-disable-next-line
  }, [tripId, accessToken, locationPermission]);

  const requestPermission = async () => {
    if (Platform.OS === "web") {
      setLocationPermission(true);
      return;
    }
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === "granted");
    if (status !== "granted") console.warn("Location permission denied");
  };

  const startSocket = () => {
    if (socket) return;
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token: accessToken },
    });

    socket.on("connect", () => {
      setIsConnected(true);
      if (tripId) socket?.emit("trip:join", { tripId });
      startLocationUpdates();
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      stopLocationUpdates();
    });

    socket.on("connect_error", (err: any) => {
      console.error("Socket connection error:", err.message);
    });
  };

  const stopSocket = () => {
    disconnectSocket();
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };

  const sendLocationUpdate = useCallback((payload: LocationPayload) => {
    if (socket && socket.connected) {
      socket.emit("location:driver:update", payload);
    }
  }, []);

  const sendTripData = useCallback((event: string, data: any) => {
    if (socket && socket.connected) {
      socket.emit(event, data);
    }
  }, []);

  const startLocationUpdates = () => {
    if (locationInterval.current) clearInterval(locationInterval.current);

    locationInterval.current = setInterval(async () => {
      if (!socket || !socket.connected || !locationPermission || !tripId)
        return;

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
          tripId,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: new Date().toISOString(),
        };

        sendLocationUpdate(payload);
      } catch (err) {
        console.warn("Failed to get/send location:", err);
      }
    }, 10000);
  };

  const stopLocationUpdates = () => {
    if (locationInterval.current) {
      clearInterval(locationInterval.current);
      locationInterval.current = null;
    }
  };

  return {
    isConnected,
    locationPermission,
    startSocket,
    stopSocket,
    sendLocationUpdate,
    sendTripData,
  };
};
