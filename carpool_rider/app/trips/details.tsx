import { useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useThemeStore } from "@/store/themeStore";
import { useTripStore } from "@/store/tripStore";
import { Text, Card, Button, Rating, Badge, Divider } from "@/components/ui";
import {
  Clock,
  Phone,
  MessageCircle,
  DollarSign,
  Calendar,
  Users,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getColors } from "@/constants/color";
import { useTranslation } from "@/constants/i18n";
import layout from "@/constants/layout";
import { getStatusColor, getStatusText } from "@/components/trips/material";
import { arrivalTime, formatDate, formatTime } from "@/lib/utils";
import { api } from "@/services/api";

export default function TripDetailsScreen() {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { t } = useTranslation();
  const router = useRouter();
  const { selectedTrip, isLoading, error, rateTrip, clearTrip } =
    useTripStore();

  const handleCall = () => {
    const phoneNumber = selectedTrip?.driver?.phone || "";
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleMessage = () => {
    const phoneNumber = selectedTrip?.driver?.phone || "";
    if (phoneNumber) {
      if (Platform.OS === "ios") {
        Linking.openURL(`sms:${phoneNumber}`);
      } else {
        Linking.openURL(`sms:${phoneNumber}`);
      }
    }
  };

  const handleViewReceipt = () => {
    router.push({
      pathname: "/trips/receipt",
      params: { id: selectedTrip?._id },
    });
  };

  const handlePayNow = async () => {
    if (
      !selectedTrip?._id ||
      !selectedTrip.paymentMethod ||
      selectedTrip.paymentStatus === "success" ||
      selectedTrip.status === "canceled"
    )
      return;

    // Nếu chưa có thì gọi API lấy paymentUrl
    const res = await api.booking.pay(
      selectedTrip._id,
      selectedTrip.paymentMethod
    );
    if (!res.data) {
      console.error("Failed to get payment URL");
      return;
    }

    router.push({
      pathname: "/trips/payment",
      params: { paymentUrl: res.data },
    });
  };

  const handleRateTrip = (rating: number) => {
    if (selectedTrip?._id) {
      rateTrip(selectedTrip._id, rating);
    }
  };

  if (!selectedTrip) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.theme.background },
        ]}
      >
        <Text variant="body" color={colors.theme.textSecondary}>
          {isLoading ? t("common.loading") : error || t("trips.tripNotFound")}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.theme.background }]}
      edges={["bottom"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card variant="elevated" style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Badge
              count={40}
              text={getStatusText(selectedTrip.status || "", t)}
              variant="custom"
              color={getStatusColor(selectedTrip.status || "", colors)}
              size="medium"
            />
            <Text variant="bodySmall" color={colors.theme.textSecondary}>
              {formatDate(selectedTrip.departure)}
            </Text>
          </View>

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
                  {selectedTrip.pickup.properties.description}
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
                  {selectedTrip.dropoff.properties.description}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.tripDetails}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Calendar size={18} color={colors.theme.textSecondary} />
                <Text
                  variant="bodySmall"
                  color={colors.theme.textSecondary}
                  style={styles.detailText}
                >
                  {formatDate(selectedTrip.departure)}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Clock size={18} color={colors.theme.textSecondary} />
                <Text
                  variant="bodySmall"
                  color={colors.theme.textSecondary}
                  style={styles.detailText}
                >
                  {formatTime(selectedTrip.departure)} -{" "}
                  {formatTime(
                    arrivalTime(selectedTrip.departure, selectedTrip.duration)
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Users size={18} color={colors.theme.textSecondary} />
                <Text
                  variant="bodySmall"
                  color={colors.theme.textSecondary}
                  style={styles.detailText}
                >
                  {selectedTrip.passengers}{" "}
                  {selectedTrip.passengers === 1
                    ? t("common.passenger")
                    : t("common.passengers")}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <DollarSign size={18} color={colors.theme.textSecondary} />
                <Text
                  variant="bodySmall"
                  color={colors.theme.textSecondary}
                  style={styles.detailText}
                >
                  {selectedTrip.price.toLocaleString()} VND
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {selectedTrip.driver && (
          <Card variant="elevated" style={styles.driverCard}>
            <Text
              variant="h3"
              color={colors.theme.text}
              style={styles.cardTitle}
            >
              {t("common.driver")} & {t("common.vehicle")}
            </Text>

            <View style={styles.driverContainer}>
              <Image
                source={
                  selectedTrip.driver?.avatar
                    ? { uri: selectedTrip.driver.avatar }
                    : require("@/assets/images/icon.png")
                }
                style={styles.driverImage}
              />

              <View style={styles.driverInfo}>
                <Text variant="body" color={colors.theme.text} weight="600">
                  {selectedTrip.driver?.firstName}{" "}
                  {selectedTrip.driver?.lastName}
                </Text>

                <View style={styles.ratingContainer}>
                  <Rating
                    value={selectedTrip.driver.rating || 0}
                    size="small"
                    readonly
                  />
                  <Text
                    variant="bodySmall"
                    color={colors.theme.textSecondary}
                    style={styles.ratingText}
                  >
                    ({selectedTrip.driver.rating})
                  </Text>
                </View>
              </View>

              {selectedTrip.status !== "finished" &&
                selectedTrip.status !== "canceled" && (
                  <View style={styles.contactButtons}>
                    <TouchableOpacity
                      style={styles.contactButton}
                      onPress={handleCall}
                    >
                      <Phone size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.contactButton}
                      onPress={handleMessage}
                    >
                      <MessageCircle size={24} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                )}
            </View>

            <Divider style={styles.divider} />

            {selectedTrip.driver.vehicle && (
              <View style={styles.vehicleContainer}>
                <View style={styles.vehicleImageContainer}>
                  {selectedTrip.driver.vehicle.images &&
                  selectedTrip.driver.vehicle.images.length > 0 ? (
                    <Image
                      source={{ uri: selectedTrip.driver.vehicle.images[0] }}
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
                    {selectedTrip.driver.vehicle.make}{" "}
                    {selectedTrip.driver.vehicle.vehicleModel}
                  </Text>

                  <Text variant="bodySmall" color={colors.theme.textSecondary}>
                    {selectedTrip.driver.vehicle.color} •{" "}
                    {selectedTrip.driver.vehicle.licensePlate}
                  </Text>

                  <Text variant="bodySmall" color={colors.theme.textSecondary}>
                    {selectedTrip.driver.vehicle.type} •{" "}
                    {selectedTrip.driver.vehicle.seats} {t("common.seats")}
                  </Text>
                </View>
              </View>
            )}
          </Card>
        )}

        <Card variant="elevated" style={styles.paymentCard}>
          <Text variant="h3" color={colors.theme.text} style={styles.cardTitle}>
            {t("booking.paymentDetails")}
          </Text>

          <View style={styles.paymentDetails}>
            <View style={styles.paymentRow}>
              <Text variant="body" color={colors.theme.text}>
                {t("booking.paymentMethod")}
              </Text>
              <Text variant="body" color={colors.theme.text} weight="600">
                {selectedTrip.paymentMethod === "cash"
                  ? t("booking.cash")
                  : selectedTrip.paymentMethod === "card"
                  ? t("booking.card")
                  : t("booking.wallet")}
              </Text>
            </View>

            <View style={styles.paymentRow}>
              <Text variant="body" color={colors.theme.text}>
                {t("booking.paymentStatus")}
              </Text>
              <Badge
                count={40}
                text={
                  selectedTrip.paymentStatus === "success"
                    ? t("trips.paid")
                    : t("trips.unpaid")
                }
                variant={
                  selectedTrip.paymentStatus === "success"
                    ? "success"
                    : "warning"
                }
                size="small"
              />
            </View>

            <View style={styles.paymentRow}>
              <Text variant="body" color={colors.theme.text}>
                {t("booking.total")}
              </Text>
              <Text variant="h3" color={colors.primary}>
                {selectedTrip.price.toLocaleString()} VND
              </Text>
            </View>
          </View>

          {selectedTrip.paymentStatus === "success" ? (
            <Button
              title={t("trips.viewReceipt")}
              onPress={handleViewReceipt}
              variant="outline"
              style={styles.receiptButton}
            />
          ) : (
            <Button
              title={t("trips.payNow")}
              onPress={handlePayNow}
              variant="solid"
              style={styles.receiptButton}
            />
          )}
        </Card>

        {selectedTrip.status === "finished" && (
          <Card variant="elevated" style={styles.ratingCard}>
            <Text
              variant="h3"
              color={colors.theme.text}
              style={styles.cardTitle}
            >
              {t("booking.rateRide")}
            </Text>

            <Rating value={4.5} size="large" readonly />

            <Text
              variant="bodySmall"
              color={colors.theme.textSecondary}
              style={styles.ratingDescription}
            >
              {t("trips.alreadyRated")}
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: layout.spacing.m,
  },
  statusCard: {
    marginBottom: layout.spacing.m,
  },
  statusHeader: {
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
    marginVertical: layout.spacing.xs,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: layout.spacing.m,
  },
  detailText: {
    marginLeft: layout.spacing.xs,
  },
  driverCard: {
    marginBottom: layout.spacing.m,
  },
  cardTitle: {
    marginBottom: layout.spacing.s,
  },
  driverContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: layout.spacing.s,
  },
  driverInfo: {
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: layout.spacing.xs,
  },
  ratingText: {
    marginLeft: layout.spacing.xs,
  },
  contactButtons: {
    flexDirection: "row",
    gap: layout.spacing.s,
  },
  contactButton: {
    padding: layout.spacing.xs,
  },
  divider: {
    marginVertical: layout.spacing.m,
  },
  vehicleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleImageContainer: {
    marginRight: layout.spacing.s,
  },
  vehicleImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
  },
  vehicleImagePlaceholder: {
    width: 80,
    height: 60,
    borderRadius: 8,
  },
  vehicleInfo: {
    flex: 1,
  },
  paymentCard: {
    marginBottom: layout.spacing.m,
  },
  paymentDetails: {
    marginTop: layout.spacing.s,
    marginBottom: layout.spacing.m,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: layout.spacing.s,
  },
  receiptButton: {
    marginTop: layout.spacing.s,
  },
  ratingCard: {
    marginBottom: layout.spacing.l,
  },
  ratingDescription: {
    textAlign: "center",
    marginTop: layout.spacing.xs,
  },
});
