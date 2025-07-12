import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/color";
import { Text, SegmentedControl, Spinner, ErrorMessage } from "@/components/ui";
import { TripItem } from "@/components/trips/TripItem";
import layout from "@/constants/layout";
import { useTripStore } from "@/store/tripStore";
import { Booking } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import { useTranslation } from "@/constants/i18n";

export default function TripsScreen() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { activeTrips, pastTrips, isLoading, error, fetchTrips } =
    useTripStore();
  const { isAuthenticated } = useAuthStore();

  const trips = [...activeTrips, ...pastTrips];

  const [selectedTab, setSelectedTab] = useState(0);
  const [filteredTrips, setFilteredTrips] = useState<Booking[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    console.log("Fetching trips...");

    fetchTrips();
  }, [isAuthenticated]);

  useEffect(() => {
    filterTrips();
  }, [selectedTab, trips]);

  const filterTrips = () => {
    let status: string;

    switch (selectedTab) {
      case 0: // Upcoming
        status = "scheduled";
        break;
      case 1: // Ongoing
        status = "active";
        break;
      case 2: // Completed
        status = "completed";
        break;
      case 3: // Cancelled
        status = "cancelled";
        break;
      default:
        status = "scheduled";
    }

    setFilteredTrips(trips.filter((trip) => trip.status === status));
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text variant="body" center color={colors.theme.textSecondary}>
        {t("trips.noTrips")}
      </Text>
    </View>
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.theme.background }]}
    >
      <View style={styles.content}>
        <SegmentedControl
          values={[
            t("trips.upcoming"),
            t("trips.ongoing"),
            t("trips.completed"),
            t("trips.cancelled"),
          ]}
          selectedIndex={selectedTab}
          onChange={setSelectedTab}
          style={styles.tabSelector}
        />

        {isLoading ? (
          <Spinner size="large" text={t("common.loading")} />
        ) : error ? (
          <ErrorMessage
            message={error}
            // onRetry={fetchTrips}
          />
        ) : (
          <FlatList
            data={filteredTrips}
            renderItem={({ item }) => (
              <TripItem booking={item} onPress={() => {}} />
            )}
            keyExtractor={(item, index) => item._id || index.toString()}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: layout.spacing.l,
  },
  tabSelector: {
    marginBottom: layout.spacing.l,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: layout.spacing.xl,
  },
});
