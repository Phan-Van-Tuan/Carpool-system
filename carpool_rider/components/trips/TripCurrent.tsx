import React, { useCallback, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { Text, Card } from "@/components/ui";
import { Booking } from "@/types";
import { Clock } from "lucide-react-native";
import { getColors } from "@/constants/color";
import { useTranslation } from "@/constants/i18n";
import layout from "@/constants/layout";
import { formatDate, formatTime } from "@/lib/utils";
import { useTripSocket } from "@/services/socket";
import { useRouter } from "expo-router";

interface CurrentTripCardProps {
  booking: Booking;
  tripId: string;
  onFinish: () => void;
  driverDistance?: number;
  driverEtaText?: string;
}

export function CurrentTripCard({
  booking,
  tripId,
  onFinish,
}: CurrentTripCardProps) {
  const { theme } = useThemeStore();
  const router = useRouter();
  const colors = getColors(theme);
  const { t } = useTranslation();
  const {
    isConnected,
    driverLocation,
    bookingStatus,
    joinTrip,
    startLocationUpdates,
    stopLocationUpdates,
  } = useTripSocket();

  useEffect(() => {
    if (isConnected) {
      joinTrip(tripId);
    } else {
      console.log("Please connect the socket now.");
    }
  }, [isConnected]);

  useEffect(() => {
    if (driverLocation) {
      console.log("📍 Driver is here:", driverLocation);
      // cập nhật bản đồ
    }
  }, [driverLocation]);

  const renderStatus = useCallback(() => {
    if (!bookingStatus || !bookingStatus.status) {
      return (
        <>
          <Text variant="bodySmall" color={colors.theme.textSecondary}>
            {driverLocation?.latitude} - {driverLocation?.longitude} -
            {driverLocation?.timestamp}
          </Text>
          <Text style={[styles.statusDetail, { color: colors.primary }]}>
            {t("booking.waitingForDriver")}
          </Text>
        </>
      );
    } else if (
      bookingStatus.status === "arrived" ||
      bookingStatus.bookingId == booking._id
    ) {
      return (
        <>
          <Text variant="bodySmall" color={colors.theme.textSecondary}>
            {driverLocation?.latitude} - {driverLocation?.longitude} -
            {driverLocation?.timestamp}
          </Text>
          <Text style={[styles.statusDetail, { color: colors.primary }]}>
            {t("booking.driverArrived")}
          </Text>
        </>
      );
    } else if (
      bookingStatus.status === "picked" ||
      bookingStatus.bookingId == booking._id
    ) {
      return (
        <>
          <Text variant="bodySmall" color={colors.theme.textSecondary}>
            {driverLocation?.latitude} - {driverLocation?.longitude} -
            {driverLocation?.timestamp}
          </Text>
          <Text style={[styles.statusDetail, { color: colors.primary }]}>
            {t("trips.inProgress")}
          </Text>
        </>
      );
    } else if (
      bookingStatus.status === "dropped" ||
      bookingStatus.bookingId == booking._id
    ) {
      setTimeout(() => {
        onFinish();
      }, 1000);
      return (
        <Text style={[styles.statusDetail, { color: colors.primary }]}>
          {t("trips.completed")}
        </Text>
      );
    }
    return (
      <Text style={[styles.statusDetail, { color: colors.primary }]}>
        {t("trips.inProgress")}
      </Text>
    );
  }, [bookingStatus, driverLocation, colors, t]);

  return (
    <Card
      variant="elevated"
      style={[styles.container]}
      // onPress={() => router.push("/trips/map")}
    >
      <View style={styles.header}>
        <View style={styles.detailItem}>
          <Clock size={16} color={colors.theme.textSecondary} />
          <Text
            variant="bodySmall"
            color={colors.theme.textSecondary}
            style={styles.detailText}
          >
            {formatTime(booking.departure)}
          </Text>
        </View>
        <Text
          variant="bodySmall"
          color={colors.theme.textSecondary}
          style={styles.detailText}
        >
          {formatDate(booking.departure)}
        </Text>
      </View>

      <View style={styles.locations}>
        <View style={styles.locationItem}>
          <View
            style={[styles.locationDot, { backgroundColor: colors.primary }]}
          />
          <Text
            variant="body"
            color={colors.theme.text}
            numberOfLines={1}
            style={styles.locationText}
          >
            {booking.pickup.properties.description}
          </Text>
        </View>

        <View
          style={[
            styles.locationLine,
            { backgroundColor: colors.theme.border },
          ]}
        />

        <View style={styles.locationItem}>
          <View
            style={[
              styles.locationDot,
              { backgroundColor: colors.theme.error },
            ]}
          />
          <Text
            variant="body"
            color={colors.theme.text}
            numberOfLines={1}
            style={styles.locationText}
          >
            {booking.dropoff.properties.description}
          </Text>
        </View>
      </View>
      <View style={[styles.status, { borderColor: colors.theme.info }]}>
        {renderStatus()}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: layout.spacing.m,
    padding: layout.spacing.m,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: layout.spacing.ms,
  },
  locations: {
    marginBottom: layout.spacing.m,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: layout.spacing.s,
  },
  locationLine: {
    width: 1,
    height: 10,
    marginLeft: 5,
  },
  locationText: {
    flex: 1,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    marginLeft: 4,
  },
  status: {
    borderRadius: layout.borderRadius.medium,
    borderWidth: 1,
    padding: layout.spacing.s,
  },
  statusDetail: {},
});
