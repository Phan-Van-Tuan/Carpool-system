import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  ImageSourcePropType,
} from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/color";
import { Card, Text, Button, Avatar, Rating, Divider } from "@/components/ui";
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  AlertTriangle,
} from "lucide-react-native";
import { useBookingStore } from "@/store/bookingStore";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import layout from "@/constants/layout";
import { Modal } from "@/components/ui/Modal";
import { useTranslation } from "@/constants/i18n";

// Mock driver data
const driverData = {
  id: "driver1",
  name: "John Smith",
  avatar:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvcnRyYWl0JTIwbWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  rating: 4.8,
  vehicle: "Toyota Camry",
  plateNumber: "51A-12345",
  phone: "+84123456789",
};

// Ride status enum
type RideStatus = "finding" | "arriving" | "arrived" | "started" | "completed";

export const RideTracking: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { currentBooking, pickupLocation, dropoffLocation, cancelBooking } =
    useBookingStore();

  const [rideStatus, setRideStatus] = useState<RideStatus>("finding");
  const [estimatedTime, setEstimatedTime] = useState(5);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Simulate ride progress
  useEffect(() => {
    const statusSequence: RideStatus[] = [
      "finding",
      "arriving",
      "arrived",
      "started",
      "completed",
    ];
    const timeouts: NodeJS.Timeout[] = [];

    statusSequence.forEach((status, index) => {
      const timeout = setTimeout(() => {
        setRideStatus(status);

        // Update estimated time
        if (status === "arriving") {
          setEstimatedTime(3);
        } else if (status === "arrived") {
          setEstimatedTime(0);
        }

        // Show rating modal when completed
        if (status === "completed") {
          setTimeout(() => {
            setShowRatingModal(true);
          }, 1000);
        }
      }, (index + 1) * 5000); // Change status every 5 seconds

      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  const handleCallDriver = () => {
    // In a real app, this would initiate a phone call
    console.log("Calling driver:", driverData.phone);
  };

  const handleMessageDriver = () => {
    // In a real app, this would open a chat with the driver
    console.log("Messaging driver:", driverData.id);
  };

  const handleCancelRide = () => {
    setShowCancelModal(true);
  };

  const confirmCancelRide = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsLoading(true);

    try {
      if (currentBooking?.id) {
        await cancelBooking(currentBooking.id);
      }
      setShowCancelModal(false);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Cancel error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRating = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // In a real app, this would submit the rating to the backend
    console.log("Rating submitted:", rating, comment);

    setShowRatingModal(false);
    router.replace("/(tabs)");
  };

  const getStatusText = (): string => {
    switch (rideStatus) {
      case "finding":
        return t("booking.findingDriver");
      case "arriving":
        return t("booking.driverArriving");
      case "arrived":
        return t("booking.driverArrived");
      case "started":
        return t("booking.tripStarted");
      case "completed":
        return t("booking.tripCompleted");
      default:
        return "";
    }
  };

  const getStatusColor = () => {
    switch (rideStatus) {
      case "finding":
        return colors.theme.info;
      case "arriving":
        return colors.primary;
      case "arrived":
        return colors.theme.warning;
      case "started":
        return colors.theme.info;
      case "completed":
        return colors.theme.success;
      default:
        return colors.theme.text;
    }
  };

  const renderMap = () => (
    <View style={styles.mapContainer}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1569336415962-a4bd9f69c07b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFwfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        }}
        style={styles.mapImage}
        resizeMode="cover"
      />
      <View
        style={[styles.statusOverlay, { backgroundColor: getStatusColor() }]}
      >
        <Text
          variant="body"
          color="#ffffff"
          // bold
        >
          {getStatusText()}
        </Text>
        {(rideStatus === "arriving" || rideStatus === "finding") && (
          <Text variant="bodySmall" color="#ffffff">
            {estimatedTime} {t("booking.duration")}
          </Text>
        )}
      </View>
    </View>
  );

  const renderDriverInfo = () => (
    <Card style={styles.driverCard}>
      <View style={styles.driverHeader}>
        <Avatar
          source={driverData.avatar as ImageSourcePropType}
          name={driverData.name}
        />
        <View style={styles.driverInfo}>
          <Text
            variant="body"
            // bold
          >
            {driverData.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Rating value={driverData.rating} readonly />
            <Text variant="caption" style={styles.ratingText}>
              {driverData.rating}
            </Text>
          </View>
          <Text variant="caption" color={colors.theme.textSecondary}>
            {driverData.vehicle} • {driverData.plateNumber}
          </Text>
        </View>
      </View>

      <Divider />

      <View style={styles.driverActions}>
        <Button
          title={t("common.call")}
          onPress={handleCallDriver}
          variant="outline"
          icon={<Phone size={20} color={colors.primary} />}
          style={styles.actionButton}
        />
        <Button
          title={t("common.message")}
          onPress={handleMessageDriver}
          variant="outline"
          icon={<MessageCircle size={20} color={colors.primary} />}
          style={styles.actionButton}
        />
      </View>
    </Card>
  );

  const renderRideDetails = () => (
    <Card style={styles.detailsCard}>
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
        </View>
      </View>

      <View style={styles.locationDivider} />

      <View style={styles.locationItem}>
        <View
          style={[styles.locationIcon, { backgroundColor: colors.theme.error }]}
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
        </View>
      </View>
    </Card>
  );

  const renderCancelButton = () => {
    // Only show cancel button before trip starts
    if (rideStatus === "completed" || rideStatus === "started") {
      return null;
    }

    return (
      <Button
        title={t("booking.cancelRide")}
        onPress={handleCancelRide}
        variant="outline"
        icon={<AlertTriangle size={20} color={colors.theme.error} />}
        style={styles.cancelButton}
        textStyle={{ color: colors.theme.error }}
      />
    );
  };

  const renderCancelModal = () => (
    <Modal
      visible={showCancelModal}
      onClose={() => setShowCancelModal(false)}
      title={t("booking.cancelRide")}
    >
      <Text variant="body" style={styles.modalText}>
        {t("booking.cancelConfirmation")}
      </Text>

      <Text variant="body" color={colors.theme.error} style={styles.modalText}>
        {t("booking.cancellationFee")}: 20,000 VND
      </Text>

      <View style={styles.modalButtons}>
        <Button
          title={t("common.cancel")}
          onPress={() => setShowCancelModal(false)}
          variant="outline"
          style={styles.modalButton}
        />
        <Button
          title={t("common.confirm")}
          onPress={confirmCancelRide}
          // variant="danger"
          loading={isLoading}
          style={styles.modalButton}
        />
      </View>
    </Modal>
  );

  const renderRatingModal = () => (
    <Modal
      visible={showRatingModal}
      onClose={() => setShowRatingModal(false)}
      title={t("booking.rateDriver")}
    >
      <View style={styles.ratingModalContent}>
        <Avatar
          source={driverData.avatar as ImageSourcePropType}
          name={driverData.name}
          size={24}
          style={styles.ratingAvatar}
        />

        <Text
          variant="body"
          // bold
          center
          style={styles.ratingName}
        >
          {driverData.name}
        </Text>

        <Rating value={rating} onChange={setRating} size={"medium"} />

        <Button
          title={t("booking.submitRating")}
          onPress={handleSubmitRating}
          // fullWidth
          style={styles.submitRatingButton}
        />
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderMap()}
      {renderDriverInfo()}
      {renderRideDetails()}
      {renderCancelButton()}
      {renderCancelModal()}
      {renderRatingModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    height: 250,
    marginBottom: layout.spacing.m,
    borderRadius: layout.borderRadius.medium,
    overflow: "hidden",
    position: "relative",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  statusOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: layout.spacing.m,
    alignItems: "center",
  },
  driverCard: {
    marginBottom: layout.spacing.m,
  },
  driverHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: layout.spacing.m,
  },
  driverInfo: {
    marginLeft: layout.spacing.m,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: layout.spacing.xs,
  },
  ratingText: {
    marginLeft: layout.spacing.xs,
  },
  driverActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: layout.spacing.m,
  },
  actionButton: {
    flex: 0.48,
  },
  detailsCard: {
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
  cancelButton: {
    marginBottom: layout.spacing.xl,
    borderColor: "#ffcdd2",
  },
  modalText: {
    marginBottom: layout.spacing.m,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: layout.spacing.m,
  },
  modalButton: {
    flex: 0.48,
  },
  ratingModalContent: {
    alignItems: "center",
  },
  ratingAvatar: {
    marginBottom: layout.spacing.m,
  },
  ratingName: {
    marginBottom: layout.spacing.m,
  },
  submitRatingButton: {
    marginTop: layout.spacing.m,
  },
});

export default RideTracking;
