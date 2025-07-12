import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import {
  MapPin,
  Navigation,
  Clock,
  DollarSign,
  User,
  Star,
} from "lucide-react-native";
import { Trip, Booking } from "@/types/trip";
import { useLanguage } from "@/contexts/LanguageContext";
import Button from "./Button";
import Layout from "@/constants/layout";
import { formatDistance, formatDuration } from "@/utils/format";

type TripCardType = "request" | "active" | "next" | "history";

interface TripCardProps {
  trip: Trip;
  type: TripCardType;
  onAccept?: () => void;
  onReject?: () => void;
  onPress?: () => void;
  onNavigate?: () => void;
  colors: any;
}

const TripCard: React.FC<TripCardProps> = ({
  trip,
  type,
  onAccept,
  onReject,
  onPress,
  onNavigate,
  colors,
}) => {
  const { t } = useLanguage();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderTripStatus = () => {
    const statusStyles: any = {
      scheduled: { backgroundColor: colors.info },
      in_progress: { backgroundColor: colors.warning },
      completed: { backgroundColor: colors.success },
      cancelled: { backgroundColor: colors.danger },
    };

    return (
      <View style={[styles.statusBadge, statusStyles[trip.status]]}>
        <Text style={[styles.statusText, { color: colors.white }]}>
          {t(trip.status)}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <View style={styles.header}>
        {renderTripStatus()}
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationLine}>
          <View
            style={[styles.locationDot, { backgroundColor: colors.primary }]}
          />
          <View
            style={[styles.locationDash, { backgroundColor: colors.border }]}
          />
          <View
            style={[
              styles.locationDot,
              styles.destinationDot,
              { backgroundColor: colors.secondary },
            ]}
          />
        </View>
        <View style={styles.addressContainer}>
          <View style={styles.addressRow}>
            <MapPin size={16} color={colors.primary} />
            <Text
              style={[styles.address, { color: colors.text }]}
              numberOfLines={1}
            >
              {trip.startLocation.properties.description ||
                t("unknownLocation")}
            </Text>
          </View>
          <View style={styles.addressRow}>
            <MapPin size={16} color={colors.secondary} />
            <Text
              style={[styles.address, { color: colors.text }]}
              numberOfLines={1}
            >
              {trip.endLocation.properties.description || t("unknownLocation")}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.tripDetails}>
        <View style={styles.detailItem}>
          <Clock size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {type === "history"
              ? `${formatDate(trip.departure)} ${formatTime(trip.departure)}`
              : `${formatDuration(trip.duration)} • ${formatDistance(
                  trip.distance
                )}`}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <DollarSign size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {formatCurrency(
              trip.bookings.reduce((total, booking) => total + booking.price, 0)
            )}
          </Text>
        </View>
        <View className="detailItem">
          <User size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {t("cash")}
          </Text>
        </View>
      </View>

      {type === "request" && (
        <View style={styles.actions}>
          <Button
            title={t("reject")}
            variant="outline"
            size="medium"
            style={styles.rejectButton}
            onPress={onReject}
            colors={colors}
          />
          <Button
            title={t("accept")}
            variant="primary"
            size="medium"
            style={styles.acceptButton}
            onPress={onAccept}
            colors={colors}
          />
        </View>
      )}

      {type === "next" && (
        <View style={styles.actions}>
          <Button
            title={t("beginningTrip")}
            variant="primary"
            size="medium"
            style={styles.acceptButton}
            onPress={onAccept}
            colors={colors}
          />
        </View>
      )}

      {type === "active" && (
        <View style={styles.actions}>
          <Button
            title={t("navigate")}
            variant="primary"
            leftIcon={<Navigation size={16} color={colors.white} />}
            onPress={onNavigate}
            colors={colors}
          />
        </View>
      )}

      {/* {type === "history" && trip?.rating && (
        <View style={styles.ratingRow}>
          <Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>
            {t("rating")}:
          </Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                color={colors.warning}
                fill={
                  booking.rating && star <= booking.rating
                    ? colors.warning
                    : "transparent"
                }
              />
            ))}
          </View>
          {booking.note && (
            <Text
              style={[styles.feedback, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {booking.note}
            </Text>
          )}
        </View>
      )} */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.ml,
    marginBottom: Layout.spacing.ml,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Layout.spacing.ml,
  },
  statusBadge: {
    paddingHorizontal: Layout.spacing.ms,
    paddingVertical: Layout.spacing.s,
    borderRadius: Layout.borderRadius.small,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  passengerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.spacing.m,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  passengerName: {
    fontWeight: "600",
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 12,
  },
  locationContainer: {
    flexDirection: "row",
    marginBottom: Layout.spacing.ml,
  },
  locationLine: {
    width: 16,
    alignItems: "center",
    marginRight: Layout.spacing.s,
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  destinationDot: {},
  locationDash: {
    width: 2,
    height: 30,
    marginVertical: 4,
  },
  addressContainer: {
    flex: 1,
    gap: Layout.spacing.m,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.spacing.s,
  },
  address: {
    fontSize: 14,
    flex: 1,
  },
  tripDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Layout.spacing.l,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.spacing.xs,
  },
  detailText: {
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Layout.spacing.l,
  },
  rejectButton: {
    flex: 1,
  },
  acceptButton: {
    flex: 1,
  },
  ratingRow: {
    marginTop: Layout.spacing.s,
  },
  ratingLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
    marginBottom: 4,
  },
  feedback: {
    fontSize: 12,
    fontStyle: "italic",
  },
});

// Memoize the component to prevent unnecessary re-renders
export default memo(TripCard);
