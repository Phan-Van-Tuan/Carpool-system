import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useThemeStore } from "@/store/themeStore";
import { useBookingStore } from "@/store/bookingStore";
import { Text, Card, Button, Rating } from "@/components/ui";
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Share2,
  Star,
  X,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getColors } from "@/constants/color";
import { useTranslation } from "@/constants/i18n";
import layout from "@/constants/layout";
import { formatDistance } from "@/lib/utils";

export default function RideTrackingScreen() {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { t } = useTranslation();
  const router = useRouter();
  const { booking, selectedTrip, cancelBooking } = useBookingStore();

  const [rideStatus, setRideStatus] = useState<
    "waiting" | "pickup" | "inProgress" | "completed"
  >("waiting");
  const [showDetails, setShowDetails] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    // Simulate ride progress
    const waitingTimeout = setTimeout(() => {
      setRideStatus("pickup");
    }, 5000);

    const pickupTimeout = setTimeout(() => {
      setRideStatus("inProgress");
    }, 15000);

    const inProgressTimeout = setTimeout(() => {
      setRideStatus("completed");
      setShowRating(true);
    }, 25000);

    return () => {
      clearTimeout(waitingTimeout);
      clearTimeout(pickupTimeout);
      clearTimeout(inProgressTimeout);
    };
  }, []);

  const handleCall = () => {
    const phoneNumber = selectedTrip?.driver?.user?.phone || "";
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleMessage = () => {
    const phoneNumber = selectedTrip?.driver?.user?.phone || "";
    if (phoneNumber) {
      if (Platform.OS === "ios") {
        Linking.openURL(`sms:${phoneNumber}`);
      } else {
        Linking.openURL(`sms:${phoneNumber}`);
      }
    }
  };

  const handleShare = () => {
    // In a real app, implement sharing functionality
  };

  const handleCancel = async () => {
    if (booking) {
      await cancelBooking(booking._id as string);
      router.replace("/(tabs)");
    }
  };

  const handleSubmitRating = () => {
    // In a real app, submit rating to backend
    router.replace("/(tabs)");
  };

  const handleClose = () => {
    router.replace("/(tabs)");
  };

  const getStatusText = () => {
    switch (rideStatus) {
      case "waiting":
        return t("booking.waitingForDriver");
      case "pickup":
        return t("booking.driverArriving");
      case "inProgress":
        return t("booking.rideInProgress");
      case "completed":
        return t("booking.rideCompleted");
      default:
        return "";
    }
  };

  const getStatusColor = () => {
    switch (rideStatus) {
      case "waiting":
        return colors.theme.warning;
      case "pickup":
        return colors.theme.info;
      case "inProgress":
        return colors.primary;
      case "completed":
        return colors.theme.success;
      default:
        return colors.theme.textSecondary;
    }
  };

  if (!selectedTrip || !booking) {
    router.replace("/(tabs)");
    return null;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.theme.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X size={24} color={colors.theme.text} />
        </TouchableOpacity>
        <Text variant="h3" color={colors.theme.text} style={styles.headerTitle}>
          {t("booking.rideDetails")}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.mapContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1569336415962-a4bd9f69c07b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFwfGVufDB8fDB8fHww",
          }}
          style={styles.mapImage}
          resizeMode="cover"
        />
      </View>

      {/* <View style={styles.content}>*/}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        // contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="elevated" style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: getStatusColor() },
              ]}
            />
            <Text variant="bodySmall" color={colors.theme.text}>
              {getStatusText()}
            </Text>
          </View>

          <View style={styles.driverContainer}>
            <Image
              source={
                selectedTrip.driver?.user?.avatar
                  ? { uri: selectedTrip.driver.user.avatar }
                  : require("@/assets/images/icon.png")
              }
              style={styles.driverImage}
            />

            <View style={styles.driverInfo}>
              <Text variant="body" color={colors.theme.text} weight="600">
                {selectedTrip.driver?.user?.firstName}{" "}
                {selectedTrip.driver?.user?.lastName}
              </Text>

              <View style={styles.vehicleInfo}>
                <Text variant="bodySmall" color={colors.theme.textSecondary}>
                  {selectedTrip.vehicle?.make} {selectedTrip.vehicle?.model} •{" "}
                  {selectedTrip.vehicle?.color}
                </Text>
                <Text
                  variant="bodySmall"
                  color={colors.theme.text}
                  weight="600"
                >
                  {selectedTrip.vehicle?.plateNumber}
                </Text>
              </View>
            </View>

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
          </View>

          <TouchableOpacity
            style={styles.detailsToggle}
            onPress={() => setShowDetails(!showDetails)}
          >
            <Text variant="body" color={colors.primary}>
              {showDetails ? t("common.hideDetails") : t("common.showDetails")}
            </Text>
            {showDetails ? (
              <ChevronUp size={20} color={colors.primary} />
            ) : (
              <ChevronDown size={20} color={colors.primary} />
            )}
          </TouchableOpacity>

          {showDetails && (
            <View style={styles.tripDetails}>
              <View style={styles.locations}>
                <View style={styles.locationItem}>
                  <View
                    style={[
                      styles.locationDot,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                  <View style={styles.locationTextContainer}>
                    <Text
                      variant="bodySmall"
                      color={colors.theme.textSecondary}
                    >
                      {t("common.from")}
                    </Text>
                    <Text variant="body" color={colors.theme.text}>
                      {booking.pickup.properties.description}
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
                    <Text
                      variant="bodySmall"
                      color={colors.theme.textSecondary}
                    >
                      {t("common.to")}
                    </Text>
                    <Text variant="body" color={colors.theme.text}>
                      {booking.dropoff.properties.description}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <User size={18} color={colors.theme.textSecondary} />
                  <Text
                    variant="bodySmall"
                    color={colors.theme.textSecondary}
                    style={styles.detailText}
                  >
                    {booking.passengers} {t("common.passengers")}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <MapPin size={18} color={colors.theme.textSecondary} />
                  <Text
                    variant="bodySmall"
                    color={colors.theme.textSecondary}
                    style={styles.detailText}
                  >
                    {formatDistance(selectedTrip.distance)}
                  </Text>
                </View>
              </View>

              <View style={styles.priceContainer}>
                <Text variant="body" color={colors.theme.text} weight="600">
                  {t("booking.total")}
                </Text>
                <Text variant="h3" color={colors.primary}>
                  {booking.price.toLocaleString()} VND
                </Text>
              </View>
            </View>
          )}

          <View style={styles.actionButtons}>
            {/* <Button
              title={t("booking.shareTrip")}
              onPress={handleShare}
              variant="outline"
              icon={<Share2 size={20} color={colors.theme.text} />}
              style={styles.shareButton}
            /> */}

            {rideStatus !== "completed" && (
              <Button
                title={t("booking.cancelRide")}
                onPress={handleCancel}
                variant="outline"
                textStyle={{ color: colors.theme.error }}
                style={[
                  styles.cancelButton,
                  { borderColor: colors.theme.error },
                ]}
              />
            )}
          </View>
        </Card>

        {showRating && (
          <Card variant="elevated" style={styles.ratingCard}>
            <Text
              variant="h3"
              color={colors.theme.text}
              style={styles.ratingTitle}
            >
              {t("booking.rateRide")}
            </Text>

            <Rating value={rating} onChange={setRating} size="large" />

            <Button
              title={t("booking.submitRating")}
              onPress={handleSubmitRating}
              style={styles.submitButton}
            />
          </Card>
        )}
        {/* </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: layout.spacing.m,
  },
  closeButton: {
    padding: layout.spacing.s,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  mapContainer: {
    height: 250,
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    padding: layout.spacing.m,
  },
  statusCard: {
    marginBottom: layout.spacing.m,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: layout.spacing.m,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: layout.spacing.s,
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
  vehicleInfo: {
    marginTop: layout.spacing.xs,
  },
  contactButtons: {
    flexDirection: "row",
  },
  contactButton: {
    padding: layout.spacing.s,
    marginLeft: layout.spacing.s,
  },
  detailsToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: layout.spacing.s,
  },
  tripDetails: {
    marginTop: layout.spacing.m,
    paddingTop: layout.spacing.m,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
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
  detailsRow: {
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
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: layout.spacing.m,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: layout.spacing.m,
  },
  shareButton: {
    flex: 1,
    marginRight: layout.spacing.s,
  },
  cancelButton: {
    flex: 1,
    marginLeft: layout.spacing.s,
  },
  ratingCard: {
    alignItems: "center",
  },
  ratingTitle: {
    marginBottom: layout.spacing.m,
  },
  submitButton: {
    marginTop: layout.spacing.l,
    width: "100%",
  },
});
