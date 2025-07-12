// components/BookingDetailsCard.tsx
import { View, StyleSheet } from "react-native";
import { Clock, MapPin, Users } from "lucide-react-native";
import { Booking } from "@/types";
import { Card, Text } from "../ui";
import { arrivalTime, formatDate, formatTime } from "@/lib/utils";
import layout from "@/constants/layout";

interface Props {
  booking: Booking;
  colors: any;
  t: (key: string) => string;
}

export const BookingDetailsCard = ({ booking, colors, t }: Props) => {
  return (
    <Card variant="elevated" style={styles.tripCard}>
      <Text variant="h3" color={colors.theme.text} style={styles.cardTitle}>
        {t("booking.rideDetails")}
      </Text>

      <View style={styles.locations}>
        <View style={styles.locationLeft}>
          <View
            style={[styles.locationDot, { backgroundColor: colors.primary }]}
          />

          <View
            style={[
              styles.locationLine,
              { backgroundColor: colors.theme.border },
            ]}
          />
          <View
            style={[
              styles.locationDot,
              { backgroundColor: colors.theme.error },
            ]}
          />
        </View>
        <View>
          <Text
            style={styles.locationText}
            variant="body"
            color={colors.theme.text}
            numberOfLines={2}
          >
            {booking?.pickup?.properties.description}
          </Text>

          <Text
            style={styles.locationText}
            variant="body"
            color={colors.theme.text}
            numberOfLines={2}
          >
            {booking?.dropoff?.properties.description}
          </Text>
        </View>
      </View>

      <View style={styles.tripDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Clock size={18} color={colors.theme.textSecondary} />
            <View style={styles.detailTextContainer}>
              <Text variant="bodySmall" color={colors.theme.textSecondary}>
                {t("common.departure")}
              </Text>
              <Text variant="body" color={colors.theme.text}>
                {formatTime(booking?.departure)}
              </Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailTextContainer}>
              <Text variant="bodySmall" color={colors.theme.textSecondary}>
                {t("common.date")}
              </Text>
              <Text variant="body" color={colors.theme.text}>
                {formatDate(booking?.departure)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Clock size={18} color={colors.theme.textSecondary} />
            <View style={styles.detailTextContainer}>
              <Text variant="bodySmall" color={colors.theme.textSecondary}>
                {t("common.arrival")}
              </Text>
              <Text variant="body" color={colors.theme.text}>
                {formatTime(arrivalTime(booking.departure, booking.duration))}
              </Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailTextContainer}>
              <Text variant="bodySmall" color={colors.theme.textSecondary}>
                {t("common.date")}
              </Text>
              <Text variant="body" color={colors.theme.text}>
                {formatDate(arrivalTime(booking.departure, booking.duration))}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <MapPin size={18} color={colors.theme.textSecondary} />
            <View style={styles.detailTextContainer}>
              <Text variant="bodySmall" color={colors.theme.textSecondary}>
                {t("common.distance")}
              </Text>
              <Text variant="body" color={colors.theme.text}>
                {booking?.distance / 1000} km
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Users size={18} color={colors.theme.textSecondary} />
            <View style={styles.detailTextContainer}>
              <Text variant="bodySmall" color={colors.theme.textSecondary}>
                {t("common.passengers")}
              </Text>
              <Text variant="body" color={colors.theme.text}>
                {booking?.passengers}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: layout.spacing.m,
    paddingBottom: layout.spacing.xl,
  },
  tripCard: {
    marginBottom: layout.spacing.m,
    borderRadius: layout.borderRadius.medium,
  },
  cardTitle: {
    marginBottom: layout.spacing.xs,
  },
  locations: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: layout.spacing.m,
  },
  locationText: {
    marginVertical: layout.spacing.xs,
  },
  locationLeft: {
    marginTop: layout.spacing.s,
    marginBottom: layout.spacing.xl,
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: layout.spacing.s,
    marginTop: 5,
  },
  locationLine: {
    width: 1,
    flex: 1,
    marginLeft: 5,
  },
  locationTextContainer: {
    flex: 1,
  },
  tripDetails: {
    marginTop: layout.spacing.m,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: layout.spacing.m,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  detailTextContainer: {
    marginLeft: layout.spacing.s,
  },
  driverCard: {
    marginBottom: layout.spacing.m,
    borderRadius: layout.borderRadius.large,
  },
  driverContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: layout.spacing.m,
  },
  driverImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: layout.spacing.m,
  },
  driverInfo: {
    flex: 1,
  },
  divider: {
    marginVertical: layout.spacing.m,
  },
  vehicleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleImageContainer: {
    width: 80,
    height: 60,
    marginRight: layout.spacing.m,
    borderRadius: layout.borderRadius.medium,
    overflow: "hidden",
  },
  vehicleImage: {
    width: "100%",
    height: "100%",
  },
  vehicleImagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: layout.borderRadius.medium,
  },
  vehicleInfo: {
    flex: 1,
  },
  paymentCard: {
    marginBottom: layout.spacing.m,
    borderRadius: layout.borderRadius.large,
  },
  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: layout.spacing.l,
  },
  paymentOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: layout.spacing.m,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: layout.borderRadius.medium,
    marginHorizontal: layout.spacing.xs,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  paymentText: {
    marginTop: layout.spacing.s,
  },
  priceContainer: {
    marginTop: layout.spacing.m,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: layout.spacing.s,
  },
  totalRow: {
    marginTop: layout.spacing.m,
    paddingTop: layout.spacing.m,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  footer: {
    padding: layout.spacing.m,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  confirmButton: {
    borderRadius: layout.borderRadius.medium,
  },
});
