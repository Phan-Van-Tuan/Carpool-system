import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useTranslation } from "@/i18n";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/colors";
import { Card, Text, Avatar, Rating } from "@/components/ui";
import layout from "@/constants/layout";

// Mock data for nearby drivers
const nearbyDrivers = [
  {
    id: "driver1",
    name: "John Smith",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvcnRyYWl0JTIwbWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    rating: 4.8,
    vehicle: "Toyota Camry",
    plateNumber: "51A-12345",
    distance: "1.2 km",
    estimatedTime: "3 min",
  },
  {
    id: "driver2",
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9ydHJhaXQlMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    rating: 4.9,
    vehicle: "Honda Civic",
    plateNumber: "51A-67890",
    distance: "1.8 km",
    estimatedTime: "5 min",
  },
  {
    id: "driver3",
    name: "Michael Chen",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cG9ydHJhaXQlMjBtYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    rating: 4.7,
    vehicle: "Hyundai Sonata",
    plateNumber: "51A-24680",
    distance: "2.3 km",
    estimatedTime: "7 min",
  },
];

export const NearbyDrivers: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const colors = getColors(theme);

  const renderDriverItem = ({ item }: { item: (typeof nearbyDrivers)[0] }) => (
    <Card style={styles.driverCard}>
      <View style={styles.driverHeader}>
        <Avatar uri={item.avatar} name={item.name} size="medium" />
        <View style={styles.driverInfo}>
          <Text variant="body" bold>
            {item.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Rating value={item.rating} size={16} readonly />
            <Text variant="caption" style={styles.ratingText}>
              {item.rating}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.vehicleInfo}>
        <Text variant="bodySmall">
          {item.vehicle} • {item.plateNumber}
        </Text>
      </View>

      <View style={styles.distanceInfo}>
        <Text variant="caption" color={colors.theme.textSecondary}>
          {item.distance} away • {item.estimatedTime}
        </Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text variant="h4" style={styles.title}>
        {t("home.nearbyDrivers")}
      </Text>

      <FlatList
        data={nearbyDrivers}
        renderItem={renderDriverItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: layout.spacing.l,
  },
  title: {
    marginBottom: layout.spacing.m,
  },
  listContent: {
    paddingRight: layout.spacing.l,
  },
  driverCard: {
    width: 250,
    marginRight: layout.spacing.m,
  },
  driverHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: layout.spacing.s,
  },
  driverInfo: {
    marginLeft: layout.spacing.m,
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
  vehicleInfo: {
    marginBottom: layout.spacing.s,
  },
  distanceInfo: {
    marginTop: layout.spacing.xs,
  },
});

export default NearbyDrivers;
