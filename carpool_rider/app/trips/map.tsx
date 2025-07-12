import { getColors } from "@/constants/color";
import { useTripSocket } from "@/services/socket";
import { useThemeStore } from "@/store/themeStore";
import { useTripStore } from "@/store/tripStore";
import { Booking } from "@/types";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function DriverLocationPage() {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const {
    isConnected,
    driverLocation,
    bookingStatus,
    joinTrip,
    startLocationUpdates,
    stopLocationUpdates,
  } = useTripSocket();

  const { currentTrip: booking } = useTripStore();
  if (!booking) {
    return <Text>No trip data available.</Text>;
  }

  useEffect(() => {
    // Gọi socket để tham gia chuyến đi
    // joinTrip(tripId);
    // Nếu có dùng socket, bạn có thể bắt sự kiện update location tại đây
    // socket.on('driverLocationUpdate', (location) => {
    //   setDriverLocation(location);
    // });
    console.log("DriverLocationPage mounted");

    // Làm sạch khi component unmount
    return () => {
      stopLocationUpdates();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: driverLocation?.latitude || 10.1234, // Latitude mặc định nếu không có dữ liệu
          longitude: driverLocation?.longitude || 106.5678, // Longitude mặc định nếu không có dữ liệu
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {driverLocation && (
          <Marker
            coordinate={{
              latitude: driverLocation.latitude,
              longitude: driverLocation.longitude,
            }}
            title="Driver"
            description="Current driver location"
          />
        )}

        {/* Marker cho điểm đón và điểm đến của booking */}
        <Marker
          coordinate={{
            latitude: booking.pickup.geometry.coordinates[1] as number,
            longitude: booking.pickup.geometry.coordinates[0] as number,
          }}
          title="Pickup"
          description={booking.pickup.properties.description}
        />
        <Marker
          coordinate={{
            latitude: booking.dropoff.geometry.coordinates[1] as number,
            longitude: booking.dropoff.geometry.coordinates[0] as number,
          }}
          title="Dropoff"
          description={booking.dropoff.properties.description}
        />
      </MapView>
      {/* Thêm các thông tin khác cần thiết */}
      <Text>Driver status: {bookingStatus?.status}</Text>
    </View>
  );
}
