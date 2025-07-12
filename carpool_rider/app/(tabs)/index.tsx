import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin, Users, Clock, ArrowRight } from "lucide-react-native";
import layout from "@/constants/layout";
import { getColors } from "@/constants/color";
import { useTranslation } from "@/constants/i18n";
import { useThemeStore } from "@/store/themeStore";
import { useBookingStore } from "@/store/bookingStore";
import { Text, Card, Button, LocationInput } from "@/components/ui";
import DateTimePicker from "@/components/ui/DateTimePicker";
import { CurrentTripCard } from "@/components/trips/TripCurrent";
import { useTripStore } from "@/store/tripStore";

export default function HomeScreen() {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { t } = useTranslation();
  const router = useRouter();

  const {
    pickupLocation,
    dropoffLocation,
    selectedDate,
    passengers,
    error,
    fetchAvailableTrips,
    setPickupLocation,
    setDropoffLocation,
    setSelectedDate,
    setPassengers,
    setError,
  } = useBookingStore();

  const { currentTrip, currentTripIdRoom, fetchTrips } = useTripStore();
  const [loading, setLoading] = useState(false);

  const [passengerCount, setPassengerCount] = useState(passengers || 1);

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      fetchAvailableTrips();
      router.push("/ride/options");
    } catch (error) {
      setError("error");
    } finally {
      setLoading(false);
    }
  };

  const incrementPassengers = () => {
    if (passengerCount < 5) {
      const newCount = passengerCount + 1;
      setPassengerCount(newCount);
      setPassengers(newCount);
    }
  };

  const decrementPassengers = () => {
    if (passengerCount > 1) {
      const newCount = passengerCount - 1;
      setPassengerCount(newCount);
      setPassengers(newCount);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.theme.background }]}
      edges={["bottom"]}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        {/* <View
          style={[styles.welcomeSection, { borderColor: colors.theme.border }]}
        >
          <Text variant="h2" color={colors.theme.text}>
            {t("common.home")}
          </Text>
          <Text variant="body" color={colors.theme.textSecondary}>
            {t("booking.whereToGo")}
          </Text>
        </View> */}

        {/* Thanh tìm kiếm + Quét QR */}
        {/* <View style={styles.search}>
          <Input
            placeholder="Bạn muốn đi đâu?"
            style={styles.searchInput}
            leftIcon={<Search size={20} color="gray" />}
            onPress={showComingSoonAlert}
          />
          <TouchableOpacity
            style={[
              styles.qrButton,
              { backgroundColor: theme === "light" ? "#f9f9f9" : "#2c2c2c" },
            ]}
            onPress={showComingSoonAlert}
          >
            <ScanQrCode size={32} color={colors.theme.info} />
          </TouchableOpacity>
        </View> */}

        {currentTrip && (
          <View>
            <Text
              variant="h4"
              color={colors.theme.text}
              style={styles.cardTitle}
            >
              {t("trips.inProgress")}
            </Text>
            <Pressable
              onPress={() => {
                router.push("trips/map");
              }}
            >
              <CurrentTripCard
                booking={currentTrip}
                tripId={currentTripIdRoom as string}
                onFinish={fetchTrips}
              />
            </Pressable>
          </View>
        )}
        <Text variant="h4" color={colors.theme.text} style={styles.cardTitle}>
          {t("booking.bookRide")}
        </Text>
        <Card variant="elevated" style={styles.bookingCard}>
          {/* Pickup Location */}
          <LocationInput
            value={pickupLocation?.properties?.name ?? ""}
            onLocationSelect={(l) => {
              setPickupLocation(l);
            }}
            placeholder={t("booking.pickupLocation")}
            label={t("booking.pickupLocation")}
          />

          {/* Dropoff Location */}
          <LocationInput
            value={dropoffLocation?.properties?.name ?? ""}
            onLocationSelect={(l) => {
              setDropoffLocation(l);
            }}
            placeholder={t("booking.dropoffLocation")}
            label={t("booking.dropoffLocation")}
          />

          {/* Date Selection */}
          <DateTimePicker
            value={selectedDate}
            onSelect={(date: Date) => setSelectedDate(date)}
            placeholder={t("booking.date")}
            label={t("booking.when")}
          />

          {/* Passengers Selection */}
          <Text
            variant="bodySmall"
            color={colors.theme.textSecondary}
            style={styles.label}
          >
            {t("booking.passengers")}
          </Text>
          <View style={styles.passengersContainer}>
            <TouchableOpacity
              style={[
                styles.passengerButton,
                {
                  borderColor: colors.theme.border,
                  backgroundColor: colors.theme.background,
                },
              ]}
              onPress={decrementPassengers}
            >
              <Text variant="h4" color={colors.theme.text}>
                -
              </Text>
            </TouchableOpacity>
            <View
              style={[
                styles.passengerCount,
                {
                  borderColor: colors.theme.border,
                  backgroundColor: colors.theme.background,
                },
              ]}
            >
              <Text variant="h4" color={colors.theme.text}>
                {passengerCount}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.passengerButton,
                {
                  borderColor: colors.theme.border,
                  backgroundColor: colors.theme.background,
                },
              ]}
              onPress={incrementPassengers}
            >
              <Text variant="h4" color={colors.theme.text}>
                +
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search Button */}
          <Button
            title={t("booking.searchRides")}
            onPress={handleSearch}
            loading={loading}
            icon={<ArrowRight size={20} color="#fff" />}
            iconPosition="right"
            style={styles.searchButton}
          />

          {error && (
            <Text
              variant="bodySmall"
              color={colors.theme.error}
              style={styles.errorText}
            >
              {error}
            </Text>
          )}
        </Card>

        {/* Popular Routes */}
        <View style={styles.popularRoutesSection}>
          <Text
            variant="h4"
            color={colors.theme.text}
            style={styles.sectionTitle}
          >
            Popular Routes
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.routesScrollView}
          >
            {popularRoutes.map((route, index) => (
              <Card
                key={index}
                variant="elevated"
                style={styles.routeCard}
                onPress={() => {
                  // setPickupLocation({
                  //   address: route.from,
                  //   latitude: 0,
                  //   longitude: 0,
                  // });
                  // setDropoffLocation({
                  //   address: route.to,
                  //   latitude: 0,
                  //   longitude: 0,
                  // });
                }}
              >
                <Image
                  source={{ uri: route.image }}
                  style={styles.routeImage}
                />
                <View style={styles.routeInfo}>
                  <Text variant="body" color={colors.theme.text} weight="600">
                    {route.from} → {route.to}
                  </Text>
                  <View style={styles.routeDetails}>
                    <View style={styles.routeDetail}>
                      <Clock size={14} color={colors.theme.textSecondary} />
                      <Text
                        variant="bodySmall"
                        color={colors.theme.textSecondary}
                        style={styles.detailText}
                      >
                        {route.duration}
                      </Text>
                    </View>
                    <View style={styles.routeDetail}>
                      <MapPin size={14} color={colors.theme.textSecondary} />
                      <Text
                        variant="bodySmall"
                        color={colors.theme.textSecondary}
                        style={styles.detailText}
                      >
                        {route.distance}
                      </Text>
                    </View>
                    <View style={styles.routeDetail}>
                      <Users size={14} color={colors.theme.textSecondary} />
                      <Text
                        variant="bodySmall"
                        color={colors.theme.textSecondary}
                        style={styles.detailText}
                      >
                        {route.popularity}
                      </Text>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* Promotions */}
        <View style={styles.promotionsSection}>
          <Text
            variant="h4"
            color={colors.theme.text}
            style={styles.sectionTitle}
          >
            Promotions
          </Text>
          <Card variant="elevated" style={styles.promotionCard}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRpc2NvdW50fGVufDB8fDB8fHww",
              }}
              style={styles.promotionImage}
            />
            <View style={styles.promotionContent}>
              <Text variant="h4" color={colors.theme.text}>
                20% OFF Your First Ride
              </Text>
              <Text
                variant="body"
                color={colors.theme.textSecondary}
                style={styles.promotionDescription}
              >
                Use code WELCOME20 for 20% off your first ride with Carpool
                Express.
              </Text>
              <Button
                title="Apply Code"
                variant="outline"
                size="small"
                onPress={() => {}}
                style={styles.promotionButton}
              />
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Mock data for popular routes
const popularRoutes = [
  {
    from: "Downtown",
    to: "Airport",
    duration: "35 min",
    distance: "15.5 km",
    popularity: "Popular",
    image:
      "https://images.unsplash.com/photo-1577351045243-215eb755ae22?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFpcnBvcnQlMjB0ZXJtaW5hbHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    from: "University",
    to: "Shopping Mall",
    duration: "20 min",
    distance: "8.2 km",
    popularity: "Trending",
    image:
      "https://images.unsplash.com/photo-1581417478175-a9ef18f210c2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNob3BwaW5nJTIwbWFsbHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    from: "Residential Area",
    to: "Business District",
    duration: "25 min",
    distance: "12.0 km",
    popularity: "Common",
    image:
      "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1c2luZXNzJTIwZGlzdHJpY3R8ZW58MHx8MHx8fDA%3D",
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: layout.spacing.m,
  },
  bookingCard: {
    marginBottom: layout.spacing.l,
  },
  cardTitle: {
    // marginTop: layout.spacing.m,
    marginBottom: layout.spacing.s,
  },
  label: {
    marginBottom: layout.spacing.xs,
  },
  passengersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: layout.spacing.l,
  },
  passengerButton: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: layout.borderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  passengerCount: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: layout.borderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: layout.spacing.m,
  },
  searchButton: {
    marginTop: layout.spacing.m,
  },
  errorText: {
    marginTop: layout.spacing.s,
    textAlign: "center",
  },
  welcomeSection: {
    paddingBottom: layout.spacing.s,
    borderBottomWidth: 1,
  },
  popularRoutesSection: {
    marginBottom: layout.spacing.l,
  },
  sectionTitle: {
    marginBottom: layout.spacing.m,
  },
  routesScrollView: {
    marginLeft: -layout.spacing.xs,
  },
  routeCard: {
    width: 250,
    marginRight: layout.spacing.m,
    padding: 0,
    overflow: "hidden",
  },
  routeImage: {
    width: "100%",
    height: 120,
  },
  routeInfo: {
    padding: layout.spacing.m,
  },
  routeDetails: {
    flexDirection: "row",
    marginTop: layout.spacing.s,
  },
  routeDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: layout.spacing.m,
  },
  detailText: {
    marginLeft: 4,
  },
  promotionsSection: {
    marginBottom: layout.spacing.l,
  },
  promotionCard: {
    overflow: "hidden",
    padding: 0,
  },
  promotionImage: {
    width: "100%",
    height: 150,
  },
  promotionContent: {
    padding: layout.spacing.m,
  },
  promotionDescription: {
    marginTop: layout.spacing.s,
    marginBottom: layout.spacing.m,
  },
  promotionButton: {
    alignSelf: "flex-start",
  },
  search: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
  },
  searchInput: {
    flex: 1,
  },
  qrButton: {
    padding: layout.spacing.s,
    marginBottom: layout.spacing.m,
    marginLeft: layout.spacing.s,
    borderRadius: layout.spacing.s,
  },
});
