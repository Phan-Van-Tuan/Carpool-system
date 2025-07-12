import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin } from "lucide-react-native";
import { useTrip } from "@/contexts/TripContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import TripCard from "@/components/TripCard";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Layout from "@/constants/layout";
import { useAuthStore } from "@/store/auth-store";

export default function HomeScreen() {
  const router = useRouter();
  const {
    activeTrip,
    nextTrip,
    isLoading,
    refreshTrips,
    isConnected,
    startTrip,
  } = useTrip();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { driver } = useAuthStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    refreshTrips();
  }, []);

  useEffect(() => {
    if (activeTrip) {
      router.push("/trip/active");
    }
  }, [activeTrip, router]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshTrips();
    setRefreshing(false);
  }, [refreshTrips]);

  if (!driver)
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["bottom"]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>
            {t("hello", { name: driver.account.firstName })}
          </Text>
          {/* {driver.isOnline ? (
            isConnected ? (
              <View style={styles.connectedStatus}>
                <Wifi size={16} color={colors.success} />
                <Text style={[styles.connectedText, { color: colors.success }]}>
                  {t("connectedToServer")}
                </Text>
              </View>
            ) : (
              <View style={styles.disconnectedStatus}>
                <WifiOff size={16} color={colors.warning} />
                <Text
                  style={[styles.disconnectedText, { color: colors.warning }]}
                >
                  {t("connectingToServer")}
                </Text>
              </View>
            )
          ) : (
            <View style={styles.disconnectedStatus}>
              <WifiOff size={16} color={colors.danger} />
              <Text style={[styles.disconnectedText, { color: colors.danger }]}>
                {t("disconnectedToServer")}
              </Text>
            </View>
          )} */}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {activeTrip ? (
          <>
            <TripCard trip={activeTrip} type="active" colors={colors} />
          </>
        ) : nextTrip ? (
          <TripCard
            trip={nextTrip}
            type="next"
            colors={colors}
            onAccept={() =>
              startTrip(
                nextTrip._id,
                nextTrip.bookings.map((b) => b._id)
              )
            }
            onPress={() => router.push(`/trip/${nextTrip._id}`)}
          />
        ) : (
          <View style={styles.emptyContainer}>
            {isLoading ? (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t("lookingForTrips")}
              </Text>
            ) : (
              <Card style={styles.emptyCard} colors={colors}>
                <MapPin size={48} color={colors.primary} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  {t("noAssignedTrips")}
                </Text>
                <Text
                  style={[styles.emptyText, { color: colors.textSecondary }]}
                >
                  {t("waitForAssignment")}
                </Text>
                <Button
                  title={t("refresh")}
                  variant="outline"
                  onPress={onRefresh}
                  style={styles.refreshButton}
                  colors={colors}
                />
              </Card>
            )}
          </View>
        )}
        {/* // ) : (
        //   <View style={styles.offlineContainer}>
        //     <Card style={styles.offlineCard} colors={colors}>
        //       <AlertCircle size={48} color={colors.secondary} />
        //       <Text style={[styles.offlineTitle, { color: colors.text }]}>
        //         {t("youreOffline")}
        //       </Text>
        //       <Text
        //         style={[styles.offlineText, { color: colors.textSecondary }]}
        //       >
        //         {t("offlineMessage")}
        //       </Text>
        //       <Button
        //         title={t("goOnline")}
        //         onPress={() => {}}
        //         style={styles.goOnlineButton}
        //         colors={colors}
        //       />
        //     </Card>
        //   </View>
        // )} */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Layout.spacing.l,
    borderBottomWidth: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  connectedStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.spacing.xs,
  },
  connectedText: {
    fontSize: 12,
  },
  disconnectedStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.spacing.xs,
  },
  disconnectedText: {
    fontSize: 12,
  },
  content: {
    flexGrow: 1,
    padding: Layout.spacing.l,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Layout.spacing.l,
  },
  emptyCard: {
    alignItems: "center",
    padding: Layout.spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: Layout.spacing.m,
    marginBottom: Layout.spacing.s,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: Layout.spacing.l,
  },
  refreshButton: {
    minWidth: 120,
  },
  offlineContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Layout.spacing.l,
  },
  offlineCard: {
    alignItems: "center",
    padding: Layout.spacing.xl,
  },
  offlineTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: Layout.spacing.m,
    marginBottom: Layout.spacing.s,
  },
  offlineText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: Layout.spacing.l,
  },
  goOnlineButton: {
    minWidth: 120,
  },
});
