import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { Text, Card, Badge } from "@/components/ui";
import { Booking } from "@/types";
import { MapPin, Clock, Users, DollarSign } from "lucide-react-native";
import { getColors } from "@/constants/color";
import { useTranslation } from "@/constants/i18n";
import layout from "@/constants/layout";
import { format } from "date-fns";
import { getStatusColor, getStatusText } from "./material";
import { formatDate, formatMoney, formatTime } from "@/lib/utils";

interface TripItemProps {
  booking: Booking;
  onPress: () => void;
}

export function TripItem({ booking, onPress }: TripItemProps) {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { t } = useTranslation();

  // console.log(booking);

  return (
    <Card variant="elevated" style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Badge
          count={40}
          text={getStatusText(booking.status || "", t)}
          variant="custom"
          color={getStatusColor(booking.status || "", colors)}
        />
        <View style={styles.detailItem}>
          <Clock size={16} color={colors.theme.textSecondary} />
          <Text
            variant="bodySmall"
            color={colors.theme.textSecondary}
            style={styles.detailText}
          >
            {formatTime(booking.departure)} - {formatDate(booking.departure)}
          </Text>
        </View>
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

      <View style={styles.details}>
        {/* <View style={styles.detailItem}>
          <Users size={16} color={colors.theme.textSecondary} />
          <Text
            variant="bodySmall"
            color={colors.theme.textSecondary}
            style={styles.detailText}
          >
            {booking.passengers}
          </Text>
        </View> */}

        <Text variant="bodySmall" color={colors.theme.textSecondary}>
          {booking.paymentMethod}
        </Text>
        <View style={styles.detailItem}>
          <DollarSign size={16} color={colors.theme.textSecondary} />
          <Text
            variant="bodySmall"
            color={colors.theme.textSecondary}
            style={styles.detailText}
          >
            {formatMoney(booking.price || 0)}
          </Text>
        </View>
        <Badge
          count={40}
          text={
            booking.paymentStatus === "success"
              ? t("trips.paid")
              : t("trips.unpaid")
          }
          variant={booking.paymentStatus === "success" ? "success" : "warning"}
          size="small"
        />
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
    marginBottom: layout.spacing.m,
  },
  locations: {
    marginBottom: layout.spacing.m,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: layout.spacing.xs,
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: layout.spacing.s,
  },
  locationLine: {
    width: 1,
    height: 20,
    marginLeft: 5,
  },
  locationText: {
    flex: 1,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: layout.spacing.m,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    marginLeft: 4,
  },
  driver: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: layout.spacing.m,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  driverImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: layout.spacing.m,
  },
  driverInfo: {
    flex: 1,
  },
});
