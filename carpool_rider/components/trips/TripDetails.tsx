import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ImageSourcePropType,
} from "react-native";
import { Text, Card, Button, Avatar, Rating, Divider } from "@/components/ui";
import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Car,
  HandCoins,
} from "lucide-react-native";
import { Trip } from "@/types";
import { router } from "expo-router";
import layout from "@/constants/layout";
import { useTranslation } from "@/constants/i18n";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/color";

interface TripDetailsProps {
  trip: Trip;
}

export const TripDetails: React.FC<TripDetailsProps> = ({ trip }) => {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const colors = getColors(theme);

  // Mock driver data
  const driver = {
    id: "driver1",
    name: "John Smith",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvcnRyYWl0JTIwbWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    rating: 4.8,
    vehicle: "Toyota Camry",
    plateNumber: "51A-12345",
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "scheduled":
        return colors.theme.info;
      case "active":
        return colors.primary;
      case "completed":
        return colors.theme.success;
      case "cancelled":
        return colors.theme.error;
      default:
        return colors.theme.textSecondary;
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "scheduled":
        return t("trips.upcoming");
      case "active":
        return t("trips.ongoing");
      case "completed":
        return t("trips.completed");
      case "cancelled":
        return t("trips.cancelled");
      default:
        return "";
    }
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND";
  };

  const handleBookAgain = () => {
    // Pre-fill booking data
    router.push("/(tabs)");
  };

  const handleViewReceipt = () => {
    // Navigate to receipt screen
    router.push({
      pathname: "/trips/receipt",
      params: { id: trip._id },
    });
  };

  const handleContactSupport = () => {
    // Navigate to support screen
    router.push("/help");
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
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderMap()}

      <Card style={styles.tripCard}>
        <View style={styles.header}>
          <Text variant="h3">{t("trips.tripDetails")}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(trip.status) },
            ]}
          >
            <Text variant="caption" color="#ffffff">
              {getStatusText(trip.status)}
            </Text>
          </View>
        </View>

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
            <Text variant="body">{trip.startLocation}</Text>
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
            <Text variant="body">{trip.endLocation}</Text>
          </View>
        </View>

        <Divider />

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Calendar size={20} color={colors.theme.textSecondary} />
            <View style={styles.detailText}>
              <Text variant="caption" color={colors.theme.textSecondary}>
                {t("common.date")}
              </Text>
              <Text variant="body">{formatDate(trip.createdAt)}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Clock size={20} color={colors.theme.textSecondary} />
            <View style={styles.detailText}>
              <Text variant="caption" color={colors.theme.textSecondary}>
                {t("booking.duration")}
              </Text>
              <Text variant="body">{trip.duration} min</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <MapPin size={20} color={colors.theme.textSecondary} />
            <View style={styles.detailText}>
              <Text variant="caption" color={colors.theme.textSecondary}>
                {t("booking.distance")}
              </Text>
              <Text variant="body">{trip.distance} km</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <DollarSign size={20} color={colors.primary} />
            <View style={styles.detailText}>
              <Text variant="caption" color={colors.theme.textSecondary}>
                {t("booking.price")}
              </Text>
              <Text variant="body" color={colors.primary}>
                {formatPrice(trip.price)}
              </Text>
            </View>
          </View>
        </View>
      </Card>

      <Card style={styles.driverCard}>
        <Text variant="h3" style={styles.sectionTitle}>
          {t("driver.driverInfo")}
        </Text>

        <View style={styles.driverInfo}>
          <Avatar
            source={driver.avatar as ImageSourcePropType}
            name={driver.name}
          />
          <View style={styles.driverDetails}>
            <Text
              variant="body"
              // bold
            >
              {driver.name}
            </Text>
            <Rating value={driver.rating} size={"medium"} readonly />
          </View>
        </View>

        <Divider />

        <View style={styles.vehicleInfo}>
          <View style={styles.vehicleItem}>
            <Car size={20} color={colors.theme.textSecondary} />
            <Text variant="body" style={styles.vehicleText}>
              {driver.vehicle}
            </Text>
          </View>
          <View style={styles.vehicleItem}>
            <Text variant="body" style={styles.vehicleText}>
              {driver.plateNumber}
            </Text>
          </View>
        </View>
      </Card>

      <View style={styles.actions}>
        {/* {trip.status === "completed" && (
          <Button
            title={t("trips.bookAgain")}
            onPress={handleBookAgain}
            // fullWidth
            style={styles.actionButton}
          />
        )} */}

        {trip.status === "completed" && (
          <Button
            title={t("trips.payNow")}
            onPress={handleViewReceipt}
            variant="outline"
            icon={<HandCoins size={20} color={colors.primary} />}
            // fullWidth
            style={styles.actionButton}
          />
        )}

        <Button
          title={t("trips.contactSupport")}
          onPress={handleContactSupport}
          variant="outline"
          // fullWidth
          style={styles.actionButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    height: 200,
    marginBottom: layout.spacing.m,
    borderRadius: layout.borderRadius.medium,
    overflow: "hidden",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  tripCard: {
    marginBottom: layout.spacing.m,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: layout.spacing.m,
  },
  statusBadge: {
    paddingHorizontal: layout.spacing.s,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.small,
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
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: layout.spacing.m,
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
  driverCard: {
    marginBottom: layout.spacing.m,
  },
  sectionTitle: {
    marginBottom: layout.spacing.m,
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: layout.spacing.m,
  },
  driverDetails: {
    marginLeft: layout.spacing.m,
  },
  rating: {
    marginTop: layout.spacing.xs,
  },
  vehicleInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: layout.spacing.m,
  },
  vehicleItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleText: {
    marginLeft: layout.spacing.s,
  },
  actions: {
    marginBottom: layout.spacing.xl,
  },
  actionButton: {
    marginBottom: layout.spacing.m,
  },
});

export default TripDetails;
