import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import {
  Text,
  Card,
  Divider,
  Button,
  Spinner,
  ErrorMessage,
} from "@/components/ui";
import { useTripStore } from "@/store/tripStore";
import { useLocalSearchParams } from "expo-router";
import { Trip } from "@/types";
import { Share, Download, Printer } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useTranslation } from "@/constants/i18n";
import { getColors } from "@/constants/color";
import layout from "@/constants/layout";

export default function ReceiptScreen() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { trips, isLoading, error, getTripById } = useTripStore();
  const params = useLocalSearchParams<{ id: string }>();

  const [trip, setTrip] = useState<Trip | undefined>(undefined);

  useEffect(() => {
    if (params.id) {
      const foundTrip = getTripById(params.id);
      setTrip(foundTrip);
    }
  }, [params.id, trips]);

  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND";
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleShare = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // In a real app, this would share the receipt
    console.log("Sharing receipt");
  };

  const handleDownload = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // In a real app, this would download the receipt
    console.log("Downloading receipt");
  };

  const handlePrint = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // In a real app, this would print the receipt
    console.log("Printing receipt");
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.theme.background }]}
      >
        <Spinner size="large" text={t("common.loading")} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.theme.background }]}
      >
        <ErrorMessage message={error} />
      </SafeAreaView>
    );
  }

  if (!trip) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.theme.background }]}
      >
        <ErrorMessage message={t("trips.noTrips")} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.theme.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <Text variant="h2" center>
              {t("trips.receipt")}
            </Text>
            <Text
              variant="body"
              center
              color={colors.theme.textSecondary}
              style={styles.receiptDate}
            >
              {formatDate(trip.createdAt)}
            </Text>
          </View>

          <Divider />

          <View style={styles.tripDetails}>
            <Text variant="h4" style={styles.sectionTitle}>
              {t("booking.rideDetails")}
            </Text>

            <View style={styles.detailRow}>
              <Text variant="body" color={colors.theme.textSecondary}>
                {t("home.pickupLocation")}
              </Text>
              <Text variant="body">{trip.startLocation}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text variant="body" color={colors.theme.textSecondary}>
                {t("home.dropoffLocation")}
              </Text>
              <Text variant="body">{trip.endLocation}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text variant="body" color={colors.theme.textSecondary}>
                {t("booking.distance")}
              </Text>
              <Text variant="body">{trip.distance} km</Text>
            </View>

            <View style={styles.detailRow}>
              <Text variant="body" color={colors.theme.textSecondary}>
                {t("booking.duration")}
              </Text>
              <Text variant="body">{trip.duration} min</Text>
            </View>
          </View>

          <Divider />

          <View style={styles.paymentDetails}>
            <Text variant="h4" style={styles.sectionTitle}>
              {t("booking.paymentMethod")}
            </Text>

            <View style={styles.detailRow}>
              <Text variant="body" color={colors.theme.textSecondary}>
                {t("booking.paymentMethod")}
              </Text>
              <Text variant="body">{t("booking.cash")}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text variant="body" color={colors.theme.textSecondary}>
                {t("booking.price")}
              </Text>
              <Text variant="body" bold>
                {formatPrice(trip.income)}
              </Text>
            </View>
          </View>

          <Divider />

          <View style={styles.receiptFooter}>
            <Text variant="body" center color={colors.theme.textSecondary}>
              {t("common.appName")}
            </Text>
            <Text variant="caption" center color={colors.theme.textSecondary}>
              Receipt ID: {trip.id}
            </Text>
          </View>
        </Card>

        <View style={styles.actions}>
          <Button
            title={t("common.share")}
            onPress={handleShare}
            variant="outline"
            icon={<Share size={20} color={colors.primary} />}
            style={styles.actionButton}
          />

          <Button
            title={t("trips.downloadReceipt")}
            onPress={handleDownload}
            variant="outline"
            icon={<Download size={20} color={colors.primary} />}
            style={styles.actionButton}
          />

          <Button
            title={t("common.print")}
            onPress={handlePrint}
            variant="outline"
            icon={<Printer size={20} color={colors.primary} />}
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: layout.spacing.l,
  },
  receiptCard: {
    marginBottom: layout.spacing.l,
  },
  receiptHeader: {
    marginBottom: layout.spacing.l,
  },
  receiptDate: {
    marginTop: layout.spacing.xs,
  },
  sectionTitle: {
    marginBottom: layout.spacing.m,
  },
  tripDetails: {
    marginVertical: layout.spacing.l,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: layout.spacing.s,
  },
  paymentDetails: {
    marginVertical: layout.spacing.l,
  },
  receiptFooter: {
    marginTop: layout.spacing.l,
  },
  actions: {
    marginBottom: layout.spacing.xl,
  },
  actionButton: {
    marginBottom: layout.spacing.m,
  },
});
