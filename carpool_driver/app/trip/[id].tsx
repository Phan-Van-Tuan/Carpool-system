import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import {
  MapPin,
  Clock,
  DollarSign,
  Navigation,
  Phone,
  MessageSquare,
  Star,
  User,
  Map,
  Calendar,
  ChevronUp,
  ChevronDown,
} from "lucide-react-native";
import Layout from "@/constants/layout";
import { useTripStore } from "@/store/trip-store";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { useTheme } from "@/contexts/ThemeContext";
import { useTrip } from "@/contexts/TripContext";
import {
  formatCurrency,
  formatDate,
  formatDistance,
  formatDuration,
  formatTime,
} from "@/utils/format";
import { useLanguage } from "@/contexts/LanguageContext";
import { Booking } from "@/types/trip";

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();

  const tripHistory = useTripStore((state) => state.tripHistory);
  const { nextTrip } = useTrip();

  let trip = nextTrip?._id === id && nextTrip;

  if (!trip) trip = tripHistory.find((t) => t._id === id) || false;

  const [passengersDetails, setPassengersDetails] =
    React.useState<boolean>(true);

  if (!trip) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundText, { color: colors.text }]}>
            Trip not found
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.backButton}
            colors={colors}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleCallPassenger = (booking: Booking) => {
    Alert.alert(
      "Call Passenger",
      `Call ${booking.customerId.firstName} ${booking.customerId.lastName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => console.log("Calling passenger...") },
      ]
    );
  };

  const handleMessagePassenger = (booking: Booking) => {
    Alert.alert(
      "Message Passenger",
      `Send a message to ${booking.customerId.firstName} ${booking.customerId.lastName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Message",
          onPress: () => console.log("Messaging passenger..."),
        },
      ]
    );
  };

  const getStatusBadgeStyle = () => ({
    backgroundColor:
      trip.status === "completed"
        ? colors.success
        : trip.status === "cancelled"
        ? colors.danger
        : colors.info,
  });

  const getStarColor = (index: number, booking: Booking): string => {
    return booking.rating && index <= booking.rating
      ? colors.warning
      : "transparent";
  };

  const renderPassenger = (booking: Booking) => (
    <View style={[styles.topLine, { borderColor: colors.border }]}>
      <View style={styles.passengerInfo}>
        <Image
          source={{
            uri:
              booking.customerId.avatar ||
              "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
          }}
          style={styles.avatar}
          contentFit="cover"
        />
        <View>
          <Text style={[styles.passengerName, { color: colors.text }]}>
            {booking.customerId.firstName} {booking.customerId.lastName}
          </Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color={colors.warning} fill={colors.warning} />
            <Text style={[styles.rating, { color: colors.textSecondary }]}>
              {(booking.customerId.rating ?? 5).toFixed(1)}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.tripCard}>
        <View style={styles.tripDetails}>
          <View style={styles.detailItem}>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {formatTime(booking.departure)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <User size={16} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {booking.passengers}
            </Text>
          </View>
        </View>
        <View style={styles.locationContainer}>
          <View style={styles.addressContainer}>
            <View style={styles.addressRow}>
              <MapPin size={16} color={colors.primary} />
              <Text style={[styles.address, { color: colors.text }]}>
                {booking.pickup.properties.description || "Unknown"}
              </Text>
            </View>
            <View style={styles.addressRow}>
              <MapPin size={16} color={colors.secondary} />
              <Text style={[styles.address, { color: colors.text }]}>
                {booking.dropoff.properties.description || "Unknown"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.tripDetails}>
          <View style={styles.detailItem}>
            <Map size={16} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {formatDistance(booking.distance)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {formatDuration(booking.duration)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <DollarSign size={16} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {formatCurrency(booking.price)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.contactButtons}>
        <Button
          title="Call"
          variant="outline"
          size="small"
          leftIcon={<Phone size={16} color={colors.primary} />}
          style={styles.contactButton}
          onPress={() => handleCallPassenger(booking)}
          colors={colors}
        />
        <Button
          title="Message"
          variant="outline"
          size="small"
          leftIcon={<MessageSquare size={16} color={colors.primary} />}
          style={styles.contactButton}
          onPress={() => handleMessagePassenger(booking)}
          colors={colors}
        />
      </View>

      {trip.status === "completed" && booking.rating && (
        <Card style={styles.ratingCard} colors={colors}>
          <Text style={[styles.ratingTitle, { color: colors.text }]}>
            Passenger Rating & Feedback
          </Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={24}
                color={colors.warning}
                fill={
                  star <= (booking.rating || 5) ? colors.warning : "transparent"
                }
              />
            ))}
          </View>
          {booking.note ? (
            <Text style={[styles.feedback, { color: colors.text }]}>
              {booking.note}
            </Text>
          ) : (
            <Text style={[styles.noFeedback, { color: colors.textSecondary }]}>
              No feedback provided
            </Text>
          )}
        </Card>
      )}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["bottom"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.headerCard, { backgroundColor: colors.card }]}>
          <View style={styles.header}>
            <Text style={[styles.tripTitle, { color: colors.text }]}>
              {t("tripDetails")}
            </Text>
            <View style={[styles.statusBadge, getStatusBadgeStyle()]}>
              <Text style={[styles.statusText, { color: colors.white }]}>
                {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
              </Text>
            </View>
          </View>

          <View style={styles.tripTime}>
            <Calendar size={20} color={colors.primary} />
            <Text style={[styles.timeText, { color: colors.text }]}>
              {formatDate(trip.departure)} • {formatTime(trip.departure)}
            </Text>
          </View>

          <View style={styles.locationContainer}>
            <View style={styles.addressContainer}>
              <View style={styles.addressRow}>
                <MapPin size={16} color={colors.primary} />
                <Text style={[styles.address, { color: colors.text }]}>
                  {trip.startLocation.properties.description}
                </Text>
              </View>
              <View style={styles.addressRow}>
                <MapPin size={16} color={colors.secondary} />
                <Text style={[styles.address, { color: colors.text }]}>
                  {trip.endLocation.properties.description}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.tripSummary}>
            <View style={styles.summaryItem}>
              <Text
                style={[styles.summaryLabel, { color: colors.textSecondary }]}
              >
                {t("distance")}
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {formatDistance(trip.distance)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text
                style={[styles.summaryLabel, { color: colors.textSecondary }]}
              >
                {t("duration")}
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {formatDuration(trip.duration)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text
                style={[styles.summaryLabel, { color: colors.textSecondary }]}
              >
                {t("passengers")}
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {trip.bookings.reduce((sum, b) => sum + b.passengers, 0)}
              </Text>
            </View>
          </View>
        </View>

        {/* Timeline, nếu muốn có thể lấy từ trip hoặc booking */}
        <Card style={styles.timelineContainer} colors={colors}>
          {trip.waypoints.length > 0 && (
            <View style={styles.waypointsSection}>
              <Text style={[styles.waypointsTitle, { color: colors.text }]}>
                {t("waypoints")} ({trip.waypoints.length})
              </Text>
              {trip.waypoints.map((waypoint, index) => (
                <View key={index} style={styles.timelineItem}>
                  <View
                    style={[
                      styles.timelineDot,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                  <Text style={[styles.waypointText, { color: colors.text }]}>
                    {waypoint.location.properties.description}
                  </Text>
                </View>
              ))}
              <Button
                title="View Route on Map"
                leftIcon={<Navigation size={20} color={colors.white} />}
                onPress={() =>
                  Alert.alert(
                    "Coming Soon",
                    "This feature will be available in a future update."
                  )
                }
                style={styles.mapButton}
                colors={colors}
              />
            </View>
          )}
        </Card>

        <View style={[styles.headerCard, { backgroundColor: colors.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {t("passengers")} ({trip.bookings.length})
            </Text>
            <TouchableOpacity
              onPress={() => setPassengersDetails(!passengersDetails)}
              style={{ padding: 2 }}
            >
              {passengersDetails ? (
                <ChevronUp size={20} color={colors.primary} />
              ) : (
                <ChevronDown size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
          {passengersDetails &&
            trip.bookings.map((booking) => (
              <View key={booking._id} style={styles.passengerCard}>
                {renderPassenger(booking)}
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Layout.spacing.l,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Layout.spacing.ms,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: Layout.spacing.s,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.small,
  },
  completedBadge: {},
  cancelledBadge: {},
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  passengerCard: {
    marginBottom: Layout.spacing.s,
  },
  passengerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.spacing.m,
    // marginBottom: Layout.spacing.m,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  passengerName: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 14,
  },
  contactButtons: {
    flexDirection: "row",
    gap: Layout.spacing.m,
  },
  contactButton: {
    flex: 1,
  },
  tripCard: {
    paddingVertical: Layout.spacing.s,
  },
  locationContainer: {
    flexDirection: "row",
    marginBottom: Layout.spacing.m,
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
    marginBottom: Layout.spacing.m,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.spacing.xs,
  },
  detailText: {
    fontSize: 12,
  },
  tripStats: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: Layout.spacing.m,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  ratingCard: {
    marginBottom: Layout.spacing.l,
    alignItems: "center",
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Layout.spacing.m,
  },
  starsContainer: {
    flexDirection: "row",
    gap: Layout.spacing.xs,
    marginBottom: Layout.spacing.m,
  },
  feedback: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
  },
  noFeedback: {
    fontSize: 14,
    fontStyle: "italic",
  },
  timelineContainer: {
    marginBottom: Layout.spacing.xl,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Layout.spacing.m,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: Layout.spacing.m,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: Layout.spacing.m,
    position: "relative",
  },
  timelineDotLast: {},
  timelineContent: {
    flex: 1,
    borderBottomWidth: 1,
    paddingBottom: Layout.spacing.m,
  },
  timelineEvent: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  timelineTime: {
    fontSize: 12,
  },
  mapButton: {
    marginVertical: Layout.spacing.m,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Layout.spacing.l,
  },
  notFoundText: {
    fontSize: 18,
    marginBottom: Layout.spacing.l,
  },
  backButton: {
    minWidth: 120,
  },
  headerCard: {
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.ml,
    marginBottom: Layout.spacing.m,
  },
  tripTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: Layout.spacing.m,
  },
  tripTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.spacing.s,
    marginBottom: Layout.spacing.m,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "500",
  },
  tripSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Layout.spacing.m,
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: Layout.spacing.xs,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  topLine: {
    borderTopWidth: 1,
    paddingTop: Layout.spacing.m,
  },
  waypointsSection: {
    marginTop: Layout.spacing.m,
  },
  waypointsTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: Layout.spacing.s,
  },
  waypointText: {
    fontSize: 14,
  },
});
