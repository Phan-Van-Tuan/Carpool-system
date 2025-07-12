import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/color";
import { LocationInput, Button, Card, Text } from "@/components/ui";
import { ArrowRight, MapPin } from "lucide-react-native";
import { useBookingStore } from "@/store/bookingStore";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useTranslation } from "@/constants/i18n";

// Mock data for saved and recent locations
const savedLocations = [
  {
    id: "home",
    name: "Home",
    address: "123 Main Street, District 1, Ho Chi Minh City",
    type: "home",
  },
  {
    id: "work",
    name: "Work",
    address: "456 Office Tower, District 3, Ho Chi Minh City",
    type: "work",
  },
];

const recentLocations = [
  {
    id: "recent1",
    name: "Ben Thanh Market",
    address: "Le Loi, Ben Thanh, District 1, Ho Chi Minh City",
    type: "recent",
  },
  {
    id: "recent2",
    name: "Tan Son Nhat Airport",
    address: "Truong Son, Ward 2, Tan Binh District, Ho Chi Minh City",
    type: "recent",
  },
];

export const LocationSearch: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const {
    pickupLocation,
    dropoffLocation,
    setPickupLocation,
    setDropoffLocation,
  } = useBookingStore();

  const [pickup, setPickup] = useState(pickupLocation || "");
  const [dropoff, setDropoff] = useState(dropoffLocation || "");

  const handlePickupSelect = (location: any) => {
    setPickup(location.address);
    setPickupLocation(location.address);
  };

  const handleDropoffSelect = (location: any) => {
    setDropoff(location.address);
    setDropoffLocation(location.address);
  };

  const handleFindRides = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (pickup && dropoff) {
      // Save to store
      setPickupLocation(pickup);
      setDropoffLocation(dropoff);

      // Navigate to ride options
      router.push("/ride/options");
    }
  };

  const isButtonDisabled = !pickup || !dropoff;

  return (
    <Card style={styles.container}>
      <Text variant="h3" style={styles.title}>
        {t("home.whereToGo")}
      </Text>

      <View style={styles.inputsContainer}>
        <LocationInput
          value={pickup}
          onChangeText={setPickup}
          onLocationSelect={handlePickupSelect}
          placeholder={t("home.pickupLocation")}
          label={t("home.pickupLocation")}
          savedLocations={savedLocations}
          recentLocations={recentLocations}
          style={styles.input}
        />

        <View style={styles.arrowContainer}>
          <View
            style={[styles.arrowCircle, { backgroundColor: colors.primary }]}
          >
            <ArrowRight size={16} color="#ffffff" />
          </View>
        </View>

        <LocationInput
          value={dropoff}
          onChangeText={setDropoff}
          onLocationSelect={handleDropoffSelect}
          placeholder={t("home.dropoffLocation")}
          label={t("home.dropoffLocation")}
          savedLocations={savedLocations}
          recentLocations={recentLocations}
          style={styles.input}
        />
      </View>

      <Button
        title={t("home.findRides")}
        onPress={handleFindRides}
        disabled={isButtonDisabled}
        fullWidth
        style={styles.findButton}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    marginBottom: 24,
  },
  inputsContainer: {
    position: "relative",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  arrowContainer: {
    position: "absolute",
    right: 16,
    top: "50%",
    marginTop: -12,
    zIndex: 10,
  },
  arrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  findButton: {
    marginTop: 8,
  },
});

export default LocationSearch;
