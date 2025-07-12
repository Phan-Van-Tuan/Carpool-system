import React, { useEffect, useState, useCallback, memo, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Layout from "@/constants/layout";
import { useTrip } from "@/contexts/TripContext";
import TripCard from "@/components/TripCard";
import { useTheme } from "@/contexts/ThemeContext";

// Memoized trip card for better performance
const MemoizedTripCard = memo(TripCard);

// Filter button component
const FilterButton = memo(
  ({
    title,
    isActive,
    onPress,
    styles,
    colors,
  }: {
    title: string;
    isActive: boolean;
    onPress: () => void;
    styles: any;
    colors: any;
  }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        isActive && { backgroundColor: colors.primary },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterText,
          { color: colors.textSecondary },
          isActive && { backgroundColor: colors.primary, color: colors.white },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
);

export default function TripsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { tripHistory, refreshTrips, activeTrip, isLoading } = useTrip();

  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "completed" | "cancelled">(
    "all"
  );

  useEffect(() => {
    refreshTrips();
  }, [refreshTrips]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshTrips();
    setRefreshing(false);
  }, [refreshTrips]);

  const handleTripPress = useCallback(
    (tripId: string) => {
      router.push(`/trip/${tripId}`);
    },
    [router]
  );

  const handleActiveTripPress = useCallback(() => {
    router.push("/trip/active");
  }, [router]);

  const filteredTrips = tripHistory.filter((trip) => {
    if (filter === "all") return true;
    return trip.status === filter;
  });

  const renderTripCard = useCallback(
    ({ item }: any) => (
      <MemoizedTripCard
        colors={colors}
        trip={item}
        type="history"
        onPress={() => handleTripPress(item.id)}
      />
    ),
    [handleTripPress]
  );

  const renderActiveTripSection = useCallback(() => {
    if (!activeTrip) return null;

    return (
      <View style={styles.activeTripContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Active Trip
        </Text>
        <MemoizedTripCard
          colors={colors}
          trip={activeTrip}
          type="active"
          onPress={handleActiveTripPress}
          onNavigate={handleActiveTripPress}
        />
      </View>
    );
  }, [activeTrip, handleActiveTripPress]);

  const renderListHeader = useCallback(
    () => (
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Trip History
      </Text>
    ),
    []
  );

  const renderEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {isLoading
            ? "Loading trip history..."
            : "No trips found. Complete trips to see them here."}
        </Text>
      </View>
    ),
    [isLoading]
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["bottom"]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Your Trips</Text>
      </View>

      <View
        style={[styles.filterContainer, { borderBottomColor: colors.border }]}
      >
        <FilterButton
          title="All"
          isActive={filter === "all"}
          onPress={() => setFilter("all")}
          styles={styles}
          colors={colors}
        />
        <FilterButton
          title="Completed"
          isActive={filter === "completed"}
          onPress={() => setFilter("completed")}
          styles={styles}
          colors={colors}
        />
        <FilterButton
          title="Cancelled"
          isActive={filter === "cancelled"}
          onPress={() => setFilter("cancelled")}
          styles={styles}
          colors={colors}
        />
      </View>

      {renderActiveTripSection()}

      <FlatList
        data={filteredTrips}
        keyExtractor={(item) => item._id}
        renderItem={renderTripCard}
        contentContainerStyle={styles.tripsList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyComponent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
      />
    </SafeAreaView>
  );
}

// Dynamic styles to inject theme colors
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Layout.spacing.l,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    padding: Layout.spacing.m,
    borderBottomWidth: 1,
  },
  filterButton: {
    paddingVertical: Layout.spacing.m,
    paddingHorizontal: Layout.spacing.l,
    borderRadius: Layout.borderRadius.medium,
    marginRight: Layout.spacing.m,
  },
  filterText: {
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Layout.spacing.m,
  },
  activeTripContainer: {
    padding: Layout.spacing.l,
    paddingBottom: 0,
  },
  tripsList: {
    padding: Layout.spacing.l,
  },
  emptyContainer: {
    padding: Layout.spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
  },
});
