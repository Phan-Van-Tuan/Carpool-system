import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useThemeStore } from "@/store/themeStore";
import { useBookingStore } from "@/store/bookingStore";
import { Text, Card, Button, Spinner, Rating } from "@/components/ui";
import {
  MapPin,
  Clock,
  Users,
  DollarSign,
  ArrowRight,
  Armchair,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getColors } from "@/constants/color";
import { useTranslation } from "@/constants/i18n";
import layout from "@/constants/layout";
import {
  formatDate,
  formatDistance,
  formatMoney,
  formatTime,
} from "@/lib/utils";

export default function RideOptionsScreen() {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { t } = useTranslation();
  const router = useRouter();
  const {
    pickupLocation,
    dropoffLocation,
    selectedDate,
    availableTrips,
    isLoading,
    error,
    passengers,
    setSelectedTrip,
  } = useBookingStore();

  const handleSelectTrip = (tripIndex: number) => {
    setSelectedTrip(availableTrips[tripIndex]);
    router.push("/ride/confirm");
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.theme.background },
        ]}
      >
        <Spinner size="large" text={t("common.loading")} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.theme.background }]}
      edges={["bottom"]}
    >
      <View style={styles.header}>
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
              {pickupLocation?.properties.description}
            </Text>

            <Text
              style={styles.locationText}
              variant="body"
              color={colors.theme.text}
              numberOfLines={2}
            >
              {dropoffLocation?.properties.description}
            </Text>
          </View>
        </View>

        <View style={styles.tripInfo}>
          <View style={styles.infoItem}>
            <Clock size={16} color={colors.theme.textSecondary} />
            <Text
              variant="bodySmall"
              color={colors.theme.textSecondary}
              style={styles.infoText}
            >
              {selectedDate ? formatDate(selectedDate) : ""}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Users size={16} color={colors.theme.textSecondary} />
            <Text
              variant="bodySmall"
              color={colors.theme.textSecondary}
              style={styles.infoText}
            >
              {passengers}{" "}
              {passengers === 1
                ? t("common.passenger")
                : t("common.passengers")}
            </Text>
          </View>
        </View>
      </View>

      <Text variant="h3" color={colors.theme.text} style={styles.title}>
        {t("booking.availableRides")}
      </Text>

      {error ? (
        <Card variant="flat" style={styles.errorCard}>
          <Text
            variant="body"
            color={colors.theme.error}
            style={styles.errorText}
          >
            {error}
          </Text>
          <Text
            variant="bodySmall"
            color={colors.theme.textSecondary}
            style={styles.errorSubtext}
          >
            {t("booking.tryDifferentSearch")}
          </Text>
          <Button
            title={t("common.back")}
            onPress={() => router.back()}
            variant="outline"
            style={styles.backButton}
          />
        </Card>
      ) : (
        <FlatList
          data={availableTrips}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <Card variant="elevated" style={styles.tripCard}>
              <View style={styles.tripHeader}>
                <View style={styles.timeContainer}>
                  <Text variant="h3" color={colors.theme.text}>
                    {formatTime(new Date(item.estimatedPickupTime))}
                  </Text>
                  <Text variant="bodySmall" color={colors.theme.textSecondary}>
                    {formatDistance(item.estimatedDistance)}
                  </Text>
                </View>

                <View style={styles.priceContainer}>
                  <Text variant="h3" color={colors.primary}>
                    {formatMoney(item.estimatedPrice * passengers)}
                  </Text>
                  <Text variant="bodySmall" color={colors.theme.textSecondary}>
                    {passengers > 1
                      ? `${item.estimatedPrice.toLocaleString()} × ${passengers}`
                      : ""}
                  </Text>
                </View>
              </View>

              <View style={styles.tripDetails}>
                <View style={styles.detailItem}>
                  <Clock size={16} color={colors.theme.textSecondary} />
                  <Text
                    variant="bodySmall"
                    color={colors.theme.textSecondary}
                    style={styles.detailText}
                  >
                    {formatTime(new Date(item.estimatedDropoffTime))}{" "}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <MapPin size={16} color={colors.theme.textSecondary} />
                  <Text
                    variant="bodySmall"
                    color={colors.theme.textSecondary}
                    style={styles.detailText}
                  >
                    {formatDistance(item.estimatedDistance)}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Armchair size={16} color={colors.theme.textSecondary} />
                  <Text
                    variant="bodySmall"
                    color={colors.theme.textSecondary}
                    style={styles.detailText}
                  >
                    {item.availableSeats} {t("common.available")}
                  </Text>
                </View>
              </View>

              <View style={styles.driverContainer}>
                <Image
                  source={
                    item.driverId.accountId.avatar
                      ? { uri: item.driverId.accountId.avatar }
                      : require("@/assets/images/icon.png")
                  }
                  style={styles.driverImage}
                />

                <View style={styles.driverInfo}>
                  <Text variant="body" color={colors.theme.text} weight="600">
                    {item.driverId.accountId.lastName}{" "}
                    {item.driverId.accountId.firstName}
                  </Text>

                  <View style={styles.ratingContainer}>
                    <Rating
                      value={item.driverId.accountId.rating || 5}
                      size="small"
                      readonly
                    />
                  </View>
                </View>

                <View style={styles.vehicleInfo}>
                  <Text variant="bodySmall" color={colors.theme.text}>
                    {item.vehicleId.make} {item.vehicleId.vehicleModel}
                  </Text>
                  <Text variant="bodySmall" color={colors.theme.textSecondary}>
                    {item.vehicleId.color} • {item.vehicleId.licensePlate}
                  </Text>
                </View>
              </View>

              <Button
                title={t("common.select")}
                onPress={() => handleSelectTrip(index)}
                // icon={<ArrowRight size={20} color="#fff" />}
                iconPosition="right"
                style={styles.selectButton}
              />
            </Card>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            // !error && (
            <View style={styles.emptyContainer}>
              <Text
                variant="body"
                color={colors.theme.textSecondary}
                style={styles.emptyText}
              >
                {t("booking.noRidesAvailable")}
              </Text>
              <Button
                title={t("common.back")}
                onPress={() => router.back()}
                variant="outline"
                style={styles.backButton}
              />
            </View>
            // )
          }
        />
      )}
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
  header: {
    padding: layout.spacing.ms,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
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
    marginTop: layout.spacing.ms,
    marginBottom: layout.spacing.xl,
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: layout.spacing.s,
  },
  locationLine: {
    width: 1,
    flex: 1,
    minHeight: 20,
    marginLeft: 5,
  },
  tripInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: 4,
  },
  title: {
    padding: layout.spacing.m,
  },
  listContent: {
    padding: layout.spacing.m,
  },
  tripCard: {
    marginBottom: layout.spacing.m,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: layout.spacing.m,
  },
  timeContainer: {},
  priceContainer: {
    alignItems: "flex-end",
  },
  tripDetails: {
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
  driverContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: layout.spacing.m,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    marginBottom: layout.spacing.m,
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
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
  },
  vehicleInfo: {
    alignItems: "flex-end",
  },
  selectButton: {
    marginTop: layout.spacing.s,
  },
  errorCard: {
    margin: layout.spacing.m,
    alignItems: "center",
  },
  errorText: {
    marginBottom: layout.spacing.s,
    textAlign: "center",
  },
  errorSubtext: {
    marginBottom: layout.spacing.l,
    textAlign: "center",
  },
  backButton: {
    marginTop: layout.spacing.m,
  },
  emptyContainer: {
    alignItems: "center",
    padding: layout.spacing.xl,
  },
  emptyText: {
    textAlign: "center",
    marginBottom: layout.spacing.l,
  },
});
