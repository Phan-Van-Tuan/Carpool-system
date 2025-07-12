import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/color";
import { Card, Text, Button } from "@/components/ui";
import { Users, Clock, DollarSign } from "lucide-react-native";
import { useBookingStore } from "@/store/bookingStore";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import layout from "@/constants/layout";
import { useTranslation } from "@/constants/i18n";

// Mock data for ride options
const rideOptions = [
  {
    id: "standard",
    name: "Standard",
    description: "Affordable, shared rides",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2VkYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    price: 120000,
    time: "25 min",
    capacity: 4,
  },
  {
    id: "comfort",
    name: "Comfort",
    description: "Newer cars with extra legroom",
    image:
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    price: 180000,
    time: "22 min",
    capacity: 4,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Luxury rides with top-rated drivers",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    price: 250000,
    time: "20 min",
    capacity: 4,
  },
  {
    id: "van",
    name: "Van",
    description: "Rides for groups up to 6 people",
    image:
      "https://images.unsplash.com/photo-1609520505218-7421df82c7f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmFufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    price: 300000,
    time: "28 min",
    capacity: 6,
  },
];

export const RideOptions: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { pickupLocation, dropoffLocation } = useBookingStore();

  const [selectedOption, setSelectedOption] = useState(rideOptions[0]);

  const handleOptionSelect = (option: (typeof rideOptions)[0]) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedOption(option);
  };

  const handleBookRide = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    router.push({
      pathname: "/ride/confirm",
      params: {
        optionId: selectedOption.id,
        price: selectedOption.price.toString(),
      },
    });
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND";
  };

  const renderOptionItem = ({ item }: { item: (typeof rideOptions)[0] }) => {
    const isSelected = selectedOption.id === item.id;

    return (
      <TouchableOpacity
        onPress={() => handleOptionSelect(item)}
        activeOpacity={0.7}
      >
        <Card
          style={[
            styles.optionCard,
            isSelected && {
              borderColor: colors.primary,
              borderWidth: 2,
            },
          ]}
        >
          <View style={styles.optionContent}>
            <Image source={{ uri: item.image }} style={styles.optionImage} />

            <View style={styles.optionInfo}>
              <Text variant="body" 
              // bold
              >
                {item.name}
              </Text>

              <Text variant="caption" color={colors.theme.textSecondary}>
                {item.description}
              </Text>

              <View style={styles.optionDetails}>
                <View style={styles.detailItem}>
                  <Clock size={16} color={colors.theme.textSecondary} />
                  <Text variant="caption" style={styles.detailText}>
                    {item.time}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Users size={16} color={colors.theme.textSecondary} />
                  <Text variant="caption" style={styles.detailText}>
                    {item.capacity}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <DollarSign size={16} color={colors.primary} />
                  <Text
                    variant="caption"
                    color={colors.primary}
                    style={styles.detailText}
                  >
                    {formatPrice(item.price)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.locationContainer}>
        <Text
          variant="body"
          // bold
        >
          {t("home.pickupLocation")}:
        </Text>
        <Text variant="bodySmall" numberOfLines={1} style={styles.locationText}>
          {pickupLocation?.address}
        </Text>

        <Text
          variant="body"
          // bold
          style={styles.destinationLabel}
        >
          {t("home.dropoffLocation")}:
        </Text>
        <Text variant="bodySmall" numberOfLines={1} style={styles.locationText}>
          {dropoffLocation?.address}
        </Text>
      </View>

      <Text variant="h3" style={styles.title}>
        {t("booking.rideDetails")}
      </Text>

      <FlatList
        data={rideOptions}
        renderItem={renderOptionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.optionsList}
      />

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text variant="body">{t("booking.price")}:</Text>
          <Text variant="h3" color={colors.primary}>
            {formatPrice(selectedOption.price)}
          </Text>
        </View>

        <Button
          title={t("booking.bookRide")}
          onPress={handleBookRide}
          // fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  locationContainer: {
    marginBottom: layout.spacing.l,
  },
  locationText: {
    marginBottom: layout.spacing.s,
  },
  destinationLabel: {
    marginTop: layout.spacing.s,
  },
  title: {
    marginBottom: layout.spacing.m,
  },
  optionsList: {
    paddingBottom: layout.spacing.l,
  },
  optionCard: {
    marginBottom: layout.spacing.m,
  },
  optionContent: {
    flexDirection: "row",
  },
  optionImage: {
    width: 80,
    height: 80,
    borderRadius: layout.borderRadius.medium,
  },
  optionInfo: {
    flex: 1,
    marginLeft: layout.spacing.m,
  },
  optionDetails: {
    flexDirection: "row",
    marginTop: layout.spacing.s,
    flexWrap: "wrap",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: layout.spacing.m,
    marginBottom: layout.spacing.xs,
  },
  detailText: {
    marginLeft: layout.spacing.xs,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: layout.spacing.m,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: layout.spacing.m,
  },
});

export default RideOptions;
