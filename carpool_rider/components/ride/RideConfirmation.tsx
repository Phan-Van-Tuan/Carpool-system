import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { Card, Text, Button, SegmentedControl } from "@/components/ui";
import {
  MapPin,
  Clock,
  DollarSign,
  CreditCard,
  Wallet,
  BanknoteIcon,
} from "lucide-react-native";
import { useBookingStore } from "@/store/bookingStore";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { PaymentMethod } from "@/types";
import layout from "@/constants/layout";
import { useTranslation } from "@/constants/i18n";
import { getColors } from "@/constants/color";

export const RideConfirmation: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { pickupLocation, dropoffLocation, createBooking } = useBookingStore();
  const params = useLocalSearchParams<{ optionId: string; price: string }>();

  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data based on the selected option
  const rideDetails = {
    distance: "15.2 km",
    duration: "25 min",
    price: parseInt(params.price || "0"),
    pickupTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    dropoffTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
  };

  const handlePaymentMethodChange = (index: number) => {
    const methods = ["cash", "card", "wallet"];
    setPaymentMethod(methods[index]);
  };

  const getPaymentMethodIndex = (): number => {
    const methods = ["cash", "card", "wallet"];
    return methods.indexOf(paymentMethod);
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleConfirmBooking = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsLoading(true);

    try {
      const booking = await createBooking();
      // parseFloat(rideDetails.distance),
      // pickupLocation,
      // dropoffLocation,
      // 25, // duration in minutes
      // rideDetails.price,
      // paymentMethod

      if (booking) {
        router.push("/ride/tracking");
      }
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.locationCard}>
        <View style={styles.locationItem}>
          <View
            style={[styles.locationIcon, { backgroundColor: colors.primary }]}
          >
            <MapPin size={16} color="#ffffff" />
          </View>
          <View style={styles.locationInfo}>
            <Text variant="caption" color={colors.theme.textSecondary}>
              {t("home.pickupLocation")}
            </Text>
            <Text variant="body" numberOfLines={2}>
              {pickupLocation?.address}
            </Text>
            <Text variant="caption" color={colors.primary}>
              {formatTime(rideDetails.pickupTime)}
            </Text>
          </View>
        </View>

        <View style={styles.locationDivider} />

        <View style={styles.locationItem}>
          <View
            style={[
              styles.locationIcon,
              { backgroundColor: colors.theme.error },
            ]}
          >
            <MapPin size={16} color="#ffffff" />
          </View>
          <View style={styles.locationInfo}>
            <Text variant="caption" color={colors.theme.textSecondary}>
              {t("home.dropoffLocation")}
            </Text>
            <Text variant="body" numberOfLines={2}>
              {dropoffLocation?.address}
            </Text>
            <Text variant="caption" color={colors.theme.error}>
              {formatTime(rideDetails.dropoffTime)}
            </Text>
          </View>
        </View>
      </Card>

      <Card style={styles.detailsCard}>
        <Text variant="h4" style={styles.sectionTitle}>
          {t("booking.rideDetails")}
        </Text>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Clock size={20} color={colors.theme.textSecondary} />
            <View style={styles.detailText}>
              <Text variant="caption" color={colors.theme.textSecondary}>
                {t("booking.duration")}
              </Text>
              <Text variant="body">{rideDetails.duration}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <MapPin size={20} color={colors.theme.textSecondary} />
            <View style={styles.detailText}>
              <Text variant="caption" color={colors.theme.textSecondary}>
                {t("booking.distance")}
              </Text>
              <Text variant="body">{rideDetails.distance}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <DollarSign size={20} color={colors.primary} />
            <View style={styles.detailText}>
              <Text variant="caption" color={colors.theme.textSecondary}>
                {t("booking.price")}
              </Text>
              <Text variant="body" color={colors.primary}>
                {formatPrice(rideDetails.price)}
              </Text>
            </View>
          </View>
        </View>
      </Card>

      <Card style={styles.paymentCard}>
        <Text variant="h4" style={styles.sectionTitle}>
          {t("booking.paymentMethod")}
        </Text>

        <SegmentedControl
          values={[t("booking.cash"), t("booking.card"), t("booking.wallet")]}
          selectedIndex={getPaymentMethodIndex()}
          onChange={handlePaymentMethodChange}
          style={styles.paymentSelector}
        />

        {paymentMethod === "cash" && (
          <View style={styles.paymentInfo}>
            <BanknoteIcon size={24} color={colors.theme.textSecondary} />
            <Text variant="body" style={styles.paymentText}>
              Pay with cash to the driver
            </Text>
          </View>
        )}

        {paymentMethod === "card" && (
          <View style={styles.paymentInfo}>
            <CreditCard size={24} color={colors.theme.textSecondary} />
            <Text variant="body" style={styles.paymentText}>
              Pay with your saved card
            </Text>
          </View>
        )}

        {paymentMethod === "wallet" && (
          <View style={styles.paymentInfo}>
            <Wallet size={24} color={colors.theme.textSecondary} />
            <Text variant="body" style={styles.paymentText}>
              Pay with your wallet balance
            </Text>
          </View>
        )}
      </Card>

      <View style={styles.footer}>
        <Button
          title={t("booking.confirmBooking")}
          onPress={handleConfirmBooking}
          loading={isLoading}
          // fullWidth
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  locationCard: {
    marginBottom: layout.spacing.m,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: layout.spacing.m,
  },
  locationInfo: {
    flex: 1,
  },
  locationDivider: {
    height: 20,
    width: 1,
    backgroundColor: "#e0e0e0",
    marginLeft: 16,
    marginVertical: layout.spacing.xs,
  },
  detailsCard: {
    marginBottom: layout.spacing.m,
  },
  sectionTitle: {
    marginBottom: layout.spacing.m,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: layout.spacing.m,
  },
  detailText: {
    marginLeft: layout.spacing.s,
  },
  paymentCard: {
    marginBottom: layout.spacing.xl,
  },
  paymentSelector: {
    marginBottom: layout.spacing.m,
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: layout.spacing.s,
  },
  paymentText: {
    marginLeft: layout.spacing.m,
  },
  footer: {
    marginBottom: layout.spacing.xl,
  },
});

export default RideConfirmation;
