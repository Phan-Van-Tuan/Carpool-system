import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import {
  MapPin,
  Navigation,
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  CheckCircle,
  Star,
  User,
} from "lucide-react-native";
import Layout from "@/constants/layout";
import { useTrip } from "@/contexts/TripContext";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { useTheme } from "@/contexts/ThemeContext";
import { Booking } from "@/types/trip";
import { formatCurrency, formatDuration } from "@/utils/format";
import layout from "@/constants/layout";
import { api } from "@/services/api";

export default function ActiveTripScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const {
    activeTrip,
    activeTripProgress,
    completeTrip,
    updateTripStatus,
    setActiveTripProgress,
  } = useTrip();

  const [expanded, setExpanded] = useState(false);
  const [rating, setRating] = useState(5);
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    if (!activeTrip) {
      router.replace("/(tabs)");
      return;
    }
  }, [activeTrip, router]);

  if (!activeTrip) return null;

  // Tạo danh sách các điểm dừng từ các bookings
  const allStops = activeTrip.waypoints;

  const currentStopIndex = Math.floor(activeTripProgress / 2);
  const currentStop = allStops[currentStopIndex];
  const isArrived = activeTripProgress % 2 === 0;
  const isLastStop = currentStopIndex === allStops.length - 1;

  const handleNextStop = async () => {
    if (isArrived) {
      updateTripStatus(currentStop.bookingId as string, "arrived", []);
      setActiveTripProgress(activeTripProgress + 1);
    } else {
      if (currentStop.type === "pickup") {
        updateTripStatus(currentStop.bookingId as string, "picked", []);
      } else if (currentStop.type === "dropoff") {
        updateTripStatus(currentStop.bookingId as string, "dropped", []);
      }

      if (isLastStop) {
        setShowRating(true);
        await api.trips.completeTrip(activeTrip._id);
      } else {
        setActiveTripProgress(activeTripProgress + 1);
      }
    }
    console.log(`[${isArrived}] - ${currentStopIndex} - ${currentStop}`);
  };

  const handleCompleteTrip = () => {
    setActiveTripProgress(0);
    completeTrip(activeTrip._id);
    router.replace("/(tabs)");
  };

  // const handleCancelTrip = () => {
  //   Alert.alert(
  //     "Cancel Trip",
  //     "Are you sure you want to cancel this trip? This action cannot be undone.",
  //     [
  //       { text: "No", style: "cancel" },
  //       {
  //         text: "Yes, Cancel",
  //         style: "destructive",
  //         onPress: () => {
  //           cancelTrip(activeTrip._id, "Driver cancelled the trip");
  //           router.replace("/(tabs)");
  //         },
  //       },
  //     ]
  //   );
  // };

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

  const renderActionButton = () => {
    if (showRating) return null;

    let title = "";
    if (isArrived) {
      title =
        currentStop.type === "pickup"
          ? "Arrived at Pickup"
          : "Arrived at Dropoff";
    } else {
      title =
        currentStop.type === "pickup"
          ? "Pick Up Passenger"
          : "Drop Off Passenger";
    }

    return (
      <Button
        title={title}
        leftIcon={<CheckCircle size={20} color={colors.white} />}
        onPress={handleNextStop}
        colors={colors}
      />
    );
  };

  // Lấy booking tương ứng với waypoint hiện tại (nếu có bookingId)
  const getCurrentBooking = () => {
    return (
      currentStop?.bookingId &&
      activeTrip.bookings.find((b) => b._id === currentStop.bookingId)
    );
  };

  const currentBooking = getCurrentBooking();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      {showRating ? (
        <View style={styles.ratingContainer}>
          <Text style={[styles.ratingTitle, { color: colors.text }]}>
            Rate Your Experience
          </Text>
          <Text
            style={[styles.ratingSubtitle, { color: colors.textSecondary }]}
          >
            How was your trip?
          </Text>

          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Star
                  size={32}
                  color={star <= rating ? colors.warning : colors.gray}
                  fill={star <= rating ? colors.warning : colors.gray}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Button
            title="Submit Rating"
            onPress={handleCompleteTrip}
            style={styles.submitButton}
            colors={colors}
          />
        </View>
      ) : (
        <>
          <View
            style={[
              styles.header,
              {
                backgroundColor: colors.card,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ChevronDown size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.headerContent}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                {showRating
                  ? "Rate Your Trip"
                  : `${currentStopIndex}/${allStops.length}`}
              </Text>
              <View style={styles.tripProgress}>
                {allStops.map((_, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <View
                        style={[
                          styles.progressLine,
                          {
                            backgroundColor:
                              index <= currentStopIndex
                                ? colors.primary
                                : colors.border,
                          },
                        ]}
                      />
                    )}
                    <View
                      style={[
                        styles.progressStep,
                        {
                          backgroundColor:
                            index <= currentStopIndex
                              ? colors.primary
                              : colors.border,
                        },
                      ]}
                    />
                  </React.Fragment>
                ))}
              </View>
            </View>
          </View>

          <ScrollView style={styles.content}>
            {/* Passenger Card */}
            {currentBooking && (
              <Card style={styles.passengerCard} colors={colors}>
                <View style={styles.passengerInfo}>
                  <Image
                    source={{
                      uri:
                        currentBooking.customerId.avatar ||
                        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
                    }}
                    style={styles.passengerAvatar}
                    contentFit="cover"
                  />
                  <View style={styles.passengerDetails}>
                    <Text
                      style={[styles.passengerName, { color: colors.text }]}
                    >
                      {currentBooking.customerId.firstName}{" "}
                      {currentBooking.customerId.lastName}
                    </Text>
                    <Text
                      style={[styles.rating, { color: colors.textSecondary }]}
                    >
                      ★ {currentBooking.customerId.rating?.toFixed(1) || "5.0"}{" "}
                      • {currentBooking.passengers} passengers
                    </Text>
                  </View>
                </View>
                <View style={styles.passengerActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCallPassenger(currentBooking)}
                  >
                    <Phone size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleMessagePassenger(currentBooking)}
                  >
                    <MessageSquare size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </Card>
            )}

            {/* Location Card */}
            <Card style={styles.locationCard} colors={colors}>
              <View style={styles.locationItem}>
                <View
                  style={[
                    styles.locationDot,
                    { backgroundColor: colors.success },
                  ]}
                />
                <View style={styles.locationTextContainer}>
                  <Text
                    style={[
                      styles.locationLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {currentStop.type === "pickup"
                      ? "Pickup"
                      : currentStop.type === "dropoff"
                      ? "Dropoff"
                      : "Waypoint"}{" "}
                    Location
                  </Text>
                  <Text
                    style={[styles.locationAddress, { color: colors.text }]}
                  >
                    {/* Lấy địa chỉ từ booking nếu có, hoặc từ waypoint */}
                    {currentBooking
                      ? currentStop.type === "pickup"
                        ? currentBooking.pickup?.properties?.description
                        : currentStop.type === "dropoff"
                        ? currentBooking.dropoff?.properties?.description
                        : ""
                      : currentStop.location?.properties?.description || ""}
                  </Text>
                </View>
                <TouchableOpacity>
                  <Navigation size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </Card>

            <Card style={styles.tripDetailsCard} colors={colors}>
              <TouchableOpacity
                style={styles.tripDetailsHeader}
                onPress={() => setExpanded(!expanded)}
              >
                <Text style={[styles.tripDetailsTitle, { color: colors.text }]}>
                  Trip Details
                </Text>
                {expanded ? (
                  <ChevronUp size={20} color={colors.text} />
                ) : (
                  <ChevronDown size={20} color={colors.text} />
                )}
              </TouchableOpacity>

              {expanded && (
                <View style={styles.tripDetailsContent}>
                  <View style={styles.tripDetail}>
                    <View style={styles.tripDetailLeft}>
                      <Clock size={16} color={colors.textSecondary} />
                      <Text
                        style={[
                          styles.tripDetailLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Estimated duration
                      </Text>
                    </View>
                    <Text
                      style={[styles.tripDetailValue, { color: colors.text }]}
                    >
                      {formatDuration(activeTrip.duration)}
                    </Text>
                  </View>

                  <View style={styles.tripDetail}>
                    <View style={styles.tripDetailLeft}>
                      <MapPin size={16} color={colors.textSecondary} />
                      <Text
                        style={[
                          styles.tripDetailLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Distance
                      </Text>
                    </View>
                    <Text
                      style={[styles.tripDetailValue, { color: colors.text }]}
                    >
                      {(activeTrip.distance / 1000).toFixed(1)} km
                    </Text>
                  </View>

                  <View style={styles.tripDetail}>
                    <View style={styles.tripDetailLeft}>
                      <User size={16} color={colors.textSecondary} />
                      <Text
                        style={[
                          styles.tripDetailLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Passengers
                      </Text>
                    </View>
                    <Text
                      style={[styles.tripDetailValue, { color: colors.text }]}
                    >
                      {activeTrip.bookings.reduce(
                        (sum, b) => sum + b.passengers,
                        0
                      )}
                    </Text>
                  </View>

                  <View style={styles.tripDetail}>
                    <View style={styles.tripDetailLeft}>
                      <DollarSign size={16} color={colors.textSecondary} />
                      <Text
                        style={[
                          styles.tripDetailLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Total fare
                      </Text>
                    </View>
                    <Text
                      style={[styles.tripDetailValue, { color: colors.text }]}
                    >
                      {formatCurrency(
                        activeTrip.bookings.reduce((sum, b) => sum + b.price, 0)
                      )}
                    </Text>
                  </View>
                </View>
              )}
            </Card>

            <Card style={styles.stopsCard} colors={colors}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                All Stops ({allStops.length})
              </Text>
              {allStops.map((stop, index) => (
                <View
                  key={index}
                  style={[
                    styles.stopItem,
                    index === currentStopIndex && styles.currentStop,
                  ]}
                >
                  <View
                    style={[
                      styles.stopDot,
                      {
                        backgroundColor:
                          stop.type === "pickup"
                            ? colors.success
                            : colors.danger,
                      },
                    ]}
                  />
                  <View style={styles.stopInfo}>
                    <Text style={[styles.stopType, { color: colors.text }]}>
                      {stop.type === "pickup" ? "Pickup" : "Dropoff"} -{" "}
                      {/* {stop.passenger.firstName} */}
                    </Text>
                    <Text
                      style={[
                        styles.stopAddress,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {stop.location.properties.description}
                    </Text>
                    {index === currentStopIndex && (
                      <Text
                        style={[
                          styles.currentStopText,
                          { color: colors.primary },
                        ]}
                      >
                        Current Stop
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </Card>
          </ScrollView>

          <View
            style={[
              styles.footer,
              { backgroundColor: colors.card, borderTopColor: colors.border },
            ]}
          >
            {renderActionButton()}
            {/* {!showRating && (
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: colors.danger }]}
                // onPress={handleCancelTrip}
              >
                <Text style={[styles.cancelButtonText, { color: colors.danger }]}>
                  Cancel Trip
                </Text>
              </TouchableOpacity>
            )} */}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Layout.spacing.m,
  },
  ratingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Layout.spacing.l,
  },
  ratingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  ratingSubtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  submitButton: {
    width: "100%",
  },
  header: {
    padding: Layout.spacing.m,
    borderBottomWidth: 1,
  },
  backButton: {
    position: "absolute",
    padding: layout.spacing.m,
    marginBottom: Layout.spacing.s,
  },
  headerContent: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Layout.spacing.m,
  },
  tripProgress: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
  },
  progressStep: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  progressLine: {
    flex: 1,
    height: 2,
  },
  passengerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Layout.spacing.m,
    padding: Layout.spacing.m,
  },
  passengerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  passengerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: Layout.spacing.m,
  },
  passengerDetails: {},
  passengerName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
  },
  passengerActions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: Layout.spacing.m,
  },
  locationCard: {
    marginBottom: Layout.spacing.m,
    padding: Layout.spacing.m,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Layout.spacing.s,
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Layout.spacing.m,
  },
  locationTextContainer: {
    marginRight: Layout.spacing.s,
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
  },
  tripDetailsCard: {
    marginBottom: Layout.spacing.m,
    padding: Layout.spacing.m,
  },
  tripDetailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tripDetailsTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  tripDetailsContent: {
    marginTop: Layout.spacing.m,
  },
  tripDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Layout.spacing.s,
  },
  tripDetailLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripDetailLabel: {
    marginLeft: Layout.spacing.s,
    fontSize: 14,
  },
  tripDetailValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    padding: Layout.spacing.m,
    borderTopWidth: 1,
  },
  cancelButton: {
    marginTop: Layout.spacing.m,
    paddingVertical: Layout.spacing.s,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontWeight: "500",
  },
  stopsCard: {
    marginBottom: Layout.spacing.m,
    padding: Layout.spacing.m,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Layout.spacing.m,
  },
  stopItem: {
    flexDirection: "row",
    paddingVertical: Layout.spacing.s,
    alignItems: "flex-start",
  },
  currentStop: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderRadius: 8,
    marginHorizontal: -Layout.spacing.m,
    paddingHorizontal: Layout.spacing.m,
  },
  stopDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Layout.spacing.m,
    marginTop: 5,
  },
  stopInfo: {
    flex: 1,
  },
  stopType: {
    fontSize: 14,
    fontWeight: "500",
  },
  stopAddress: {
    fontSize: 13,
    marginTop: 2,
  },
  currentStopText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});
