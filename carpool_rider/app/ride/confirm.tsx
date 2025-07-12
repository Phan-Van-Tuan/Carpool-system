import React, { ReactNode, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useThemeStore } from "@/store/themeStore";
import { useBookingStore } from "@/store/bookingStore";
import { Text, Card, Button, Divider, Input } from "@/components/ui";
import { MapPin, Clock, Users } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getColors } from "@/constants/color";
import { useTranslation } from "@/constants/i18n";
import layout from "@/constants/layout";
import {
  formatDate,
  formatDistance,
  formatMoney,
  formatTime,
  toRgba,
} from "@/lib/utils";

export default function RideConfirmScreen() {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { t } = useTranslation();
  const router = useRouter();
  const {
    pickupLocation,
    dropoffLocation,
    selectedTrip,
    passengers,
    isLoading,
    confirmBooking,
    setBooking,
  } = useBookingStore();

  const [selectedMethod, setSelectedMethod] = useState<PM>("cash");
  const [note, setNote] = useState("");

  const handleConfirmBooking = async () => {
    if (!selectedTrip) {
      router.replace("/ride/options");
      return;
    }

    if (!pickupLocation || !dropoffLocation) {
      return Alert.alert(t("common.error"), t("booking.locationMissing"), [
        { text: t("common.ok"), style: "cancel" },
      ]);
    }

    try {
      const {
        _id: tripId,
        estimatedPickupTime,
        estimatedDropoffTime,
        estimatedPrice = 0,
        estimatedDistance = 0,
      } = selectedTrip;

      const departure = estimatedPickupTime;
      const duration = estimatedDropoffTime
        ? (new Date(estimatedDropoffTime).getTime() -
            new Date(estimatedPickupTime).getTime()) /
          1000
        : 0;

      const price = estimatedPrice * passengers;

      const bookingData = {
        tripId,
        pickup: pickupLocation,
        dropoff: dropoffLocation,
        passengers,
        estimatedPickupTime,
        estimatedDropoffTime,
        estimatedPrice: price,
        estimatedDistance,
        paymentMethod: selectedMethod,
      };

      setBooking({
        ...bookingData,
        note,
        status: "pending",
        paymentStatus: "pending",
        rating: 5,
        departure,
        distance: estimatedDistance,
        duration,
        price,
      });

      const success = await confirmBooking();

      if (!success) {
        throw new Error(t("booking.failedToConfirm"));
      }

      router.push("/(tabs)");
    } catch (error) {
      Alert.alert(
        t("common.error"),
        error instanceof Error ? error.message : t("common.unknownError"),
        [{ text: t("common.ok"), style: "cancel" }]
      );
    }
  };

  if (!selectedTrip) {
    router.replace("/ride/options");
    return null;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.theme.background }]}
      edges={["bottom"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card variant="elevated" style={styles.tripCard}>
          <Text variant="h3" color={colors.theme.text} style={styles.cardTitle}>
            {t("booking.rideDetails")}
          </Text>

          <View style={styles.locations}>
            <View style={styles.locationItem}>
              <View
                style={[
                  styles.locationDot,
                  { backgroundColor: colors.primary },
                ]}
              />
              <View style={styles.locationTextContainer}>
                <Text variant="bodySmall" color={colors.theme.textSecondary}>
                  {t("common.from")}
                </Text>
                <Text variant="body" color={colors.theme.text}>
                  {pickupLocation?.properties.description}
                </Text>
              </View>
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
              <View style={styles.locationTextContainer}>
                <Text variant="bodySmall" color={colors.theme.textSecondary}>
                  {t("common.to")}
                </Text>
                <Text variant="body" color={colors.theme.text}>
                  {dropoffLocation?.properties.description}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.tripDetails}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Clock size={18} color={colors.theme.textSecondary} />
                <View style={styles.detailTextContainer}>
                  <Text variant="bodySmall" color={colors.theme.textSecondary}>
                    {t("common.date")}
                  </Text>
                  <Text variant="body" color={colors.theme.text}>
                    {formatDate(new Date(selectedTrip.estimatedPickupTime))}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Clock size={18} color={colors.theme.textSecondary} />
                <View style={styles.detailTextContainer}>
                  <Text variant="bodySmall" color={colors.theme.textSecondary}>
                    {t("common.departure")}
                  </Text>
                  <Text variant="body" color={colors.theme.text}>
                    {formatTime(new Date(selectedTrip.estimatedPickupTime))}
                  </Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <Clock size={18} color={colors.theme.textSecondary} />
                <View style={styles.detailTextContainer}>
                  <Text variant="bodySmall" color={colors.theme.textSecondary}>
                    {t("common.arrival")}
                  </Text>
                  <Text variant="body" color={colors.theme.text}>
                    {formatTime(new Date(selectedTrip.estimatedDropoffTime))}
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
                    {formatDistance(selectedTrip.estimatedDistance)}
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
                    {passengers}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        <Card variant="elevated" style={styles.driverCard}>
          <Text variant="h3" color={colors.theme.text} style={styles.cardTitle}>
            {t("common.driver")} & {t("common.vehicle")}
          </Text>

          <View style={styles.driverContainer}>
            <Image
              source={
                selectedTrip.driverId.accountId.avatar
                  ? { uri: selectedTrip.driverId.accountId.avatar }
                  : require("@/assets/images/icon.png")
              }
              style={styles.driverImage}
            />

            <View style={styles.driverInfo}>
              <Text variant="body" color={colors.theme.text} weight="600">
                {selectedTrip.driverId.accountId.lastName}{" "}
                {selectedTrip.driverId.accountId.firstName}
              </Text>

              <Text variant="bodySmall" color={colors.theme.textSecondary}>
                {selectedTrip.driverId.accountId.rating || 5} ★
              </Text>
              <Text variant="bodySmall" color={colors.theme.textSecondary}>
                {Math.floor(
                  (new Date().getTime() -
                    new Date(
                      selectedTrip.driverId.accountId.createdAt
                    ).getTime()) /
                    (1000 * 60 * 60 * 24 * 365)
                ) || 1}{" "}
                {t("profile.yearsExperience")}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.vehicleContainer}>
            <View style={styles.vehicleImageContainer}>
              {selectedTrip.vehicleId.images &&
              selectedTrip.vehicleId.images.length > 0 ? (
                <Image
                  source={{ uri: selectedTrip.vehicleId.images[0] }}
                  style={styles.vehicleImage}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={[
                    styles.vehicleImagePlaceholder,
                    { backgroundColor: colors.theme.border },
                  ]}
                />
              )}
            </View>

            <View style={styles.vehicleInfo}>
              <Text variant="body" color={colors.theme.text} weight="600">
                {selectedTrip.vehicleId.make}{" "}
                {selectedTrip.vehicleId.vehicleModel}
              </Text>

              <Text variant="bodySmall" color={colors.theme.textSecondary}>
                {selectedTrip.vehicleId.color} •{" "}
                {selectedTrip.vehicleId.licensePlate}
              </Text>

              <Text variant="bodySmall" color={colors.theme.textSecondary}>
                {selectedTrip.vehicleId.type} • {selectedTrip.vehicleId.seats}{" "}
                {t("common.seats")}
              </Text>
            </View>
          </View>
        </Card>

        <Card variant="elevated" style={styles.paymentCard}>
          <Text variant="h3" color={colors.theme.text} style={styles.cardTitle}>
            {t("input.noteForDriver")}
          </Text>
          <Input
            value={note}
            onChangeText={setNote}
            placeholder={t("input.noteForDriver")}
            style={{
              paddingLeft: layout.spacing.m,
              color: colors.theme.textSecondary,
            }}
          />
        </Card>

        <Card variant="elevated" style={styles.paymentCard}>
          <Text variant="h3" color={colors.theme.text} style={styles.cardTitle}>
            {t("booking.paymentMethod")}
          </Text>

          <View style={styles.paymentOptions}>
            <PaymentItem
              active={selectedMethod}
              method={"cash"}
              title={t("booking.cash")}
              onChoose={(val) => setSelectedMethod(val)}
              colors={colors}
              icon={
                <Image
                  source={require("@/assets/images/dollar.png")}
                  style={styles.paymentIcon}
                />
              }
            />

            <PaymentItem
              active={selectedMethod}
              method={"vnpay"}
              title={t("booking.card")}
              onChoose={(val) => setSelectedMethod(val)}
              colors={colors}
              icon={
                <Image
                  source={require("@/assets/images/vnpay.png")}
                  style={styles.paymentIcon}
                />
              }
            />

            <PaymentItem
              active={selectedMethod}
              method={"momo"}
              title={t("booking.wallet")}
              onChoose={(val) => setSelectedMethod(val)}
              colors={colors}
              icon={
                <Image
                  source={require("@/assets/images/momo.png")}
                  style={styles.paymentIcon}
                />
              }
            />
          </View>

          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text variant="body" color={colors.theme.textSecondary}>
                {t("booking.baseFare")}
              </Text>
              <Text variant="body" color={colors.theme.text}>
                {formatMoney(selectedTrip.estimatedPrice)}
              </Text>
            </View>

            {passengers > 1 && (
              <View style={styles.priceRow}>
                <Text variant="body" color={colors.theme.textSecondary}>
                  {t("common.passengers")} (x{passengers})
                </Text>
                <Text variant="body" color={colors.theme.text}>
                  {formatMoney(selectedTrip.estimatedPrice * passengers)}
                </Text>
              </View>
            )}

            <View style={[styles.priceRow, styles.totalRow]}>
              <Text variant="body" color={colors.theme.text} weight="600">
                {t("booking.total")}
              </Text>
              <Text variant="h3" color={colors.primary}>
                {formatMoney(selectedTrip.estimatedPrice * passengers)}
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.theme.background,
            borderTopColor: colors.theme.border,
          },
        ]}
      >
        <Button
          title={t("booking.confirmBooking")}
          onPress={handleConfirmBooking}
          loading={isLoading}
          style={styles.confirmButton}
        />
      </View>
    </SafeAreaView>
  );
}

type PM = "cash" | "vnpay" | "momo";
function PaymentItem({
  active,
  method,
  title,
  onChoose,
  colors,
  icon,
}: {
  active: string;
  method: PM;
  title: string;
  onChoose: (val: PM) => void;
  colors: any;
  icon: ReactNode;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.paymentOption,
        method === active && {
          borderColor: colors.primary,
          backgroundColor: toRgba(colors.primary, 0.1),
        },
      ]}
      onPress={() => onChoose(method)}
    >
      {icon}
      <Text
        variant="body"
        color={method === active ? colors.primary : colors.theme.text}
        style={styles.paymentText}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

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
    borderRadius: layout.borderRadius.large,
  },
  cardTitle: {
    marginBottom: layout.spacing.m,
  },
  locations: {
    marginBottom: layout.spacing.m,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: layout.spacing.xs,
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
    height: 30,
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
  paymentIcon: {
    width: 50,
    height: 50,
  },
});
