import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { useThemeStore } from "@/store/themeStore";
import { useTripStore } from "@/store/tripStore";
import { Text, SegmentedControl, Spinner } from "@/components/ui";
import { TripItem } from "@/components/trips/TripItem";
import { Calendar, Clock, MapPin } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getColors } from "@/constants/color";
import { useTranslation } from "@/constants/i18n";
import layout from "@/constants/layout";

export default function TripsScreen() {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { t } = useTranslation();
  const router = useRouter();
  const { activeTrips, pastTrips, getTrip, isLoading, error, fetchTrips } =
    useTripStore();

  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleRefresh = () => {
    fetchTrips();
  };

  const handleTripPress = (tripId: string) => {
    if (!tripId) return;
    getTrip(tripId);
    router.push("/trips/details");
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {selectedTab === 0 ? (
        <>
          <Calendar size={60} color={colors.theme.textSecondary} />
          <Text
            variant="h3"
            color={colors.theme.text}
            style={styles.emptyTitle}
          >
            {t("trips.noUpcomingTrips")}
          </Text>
          <Text
            variant="body"
            color={colors.theme.textSecondary}
            style={styles.emptySubtitle}
          >
            {t("trips.bookRideToSee")}
          </Text>
        </>
      ) : (
        <>
          <Clock size={60} color={colors.theme.textSecondary} />
          <Text
            variant="h3"
            color={colors.theme.text}
            style={styles.emptyTitle}
          >
            {t("trips.noPastTrips")}
          </Text>
          <Text
            variant="body"
            color={colors.theme.textSecondary}
            style={styles.emptySubtitle}
          >
            {t("trips.completedTripsWillAppear")}
          </Text>
        </>
      )}
    </View>
  );

  if (isLoading && activeTrips.length === 0 && pastTrips.length === 0) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.theme.background },
        ]}
      >
        <Spinner size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.theme.background }]}
      edges={["bottom"]}
    >
      <View style={styles.header}>
        <SegmentedControl
          values={[t("trips.upcoming"), t("trips.past")]}
          selectedIndex={selectedTab}
          onChange={setSelectedTab}
        />
      </View>

      <FlatList
        data={selectedTab === 0 ? activeTrips : pastTrips}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item }) => (
          <TripItem
            booking={item}
            onPress={() => handleTripPress(item._id as string)}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          (selectedTab === 0
            ? activeTrips.length === 0
            : pastTrips.length === 0) && styles.emptyList,
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
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
    padding: layout.spacing.m,
  },
  listContent: {
    flexGrow: 1,
    padding: layout.spacing.m,
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: layout.spacing.xl,
  },
  emptyTitle: {
    marginTop: layout.spacing.l,
    marginBottom: layout.spacing.s,
  },
  emptySubtitle: {
    textAlign: "center",
  },
});
