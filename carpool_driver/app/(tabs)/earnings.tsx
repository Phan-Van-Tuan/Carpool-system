import React, { useState, useCallback, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, TrendingUp, ArrowRight } from "lucide-react-native";
import Layout from "@/constants/layout";
import { useAuthStore } from "@/store/auth-store";
import { useEarnings } from "@/contexts/EarningsContext";
import EarningsCard from "@/components/EarningsCard";
import Card from "@/components/Card"; // <-- Hook để lấy màu từ theme
import { useTheme } from "@/contexts/ThemeContext";

// Memoized tab button component
const TabButton = memo(
  ({
    title,
    isActive,
    onPress,
  }: {
    title: string;
    isActive: boolean;
    onPress: () => void;
  }) => {
    const { colors } = useTheme();
    return (
      <TouchableOpacity
        style={[styles.tab, isActive && { backgroundColor: colors.primary }]}
        onPress={onPress}
      >
        <Text style={[styles.tabText, isActive && { color: colors.white }]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
);

// Memoized breakdown item component
const BreakdownItem = memo(
  ({
    date,
    trips,
    amount,
  }: {
    date: string;
    trips: number;
    amount: number;
  }) => {
    const { colors } = useTheme();

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(value);
    };

    return (
      <View
        style={[styles.breakdownItem, { borderBottomColor: colors.border }]}
      >
        <View>
          <Text style={[styles.breakdownDate, { color: colors.text }]}>
            {date}
          </Text>
          <Text
            style={[styles.breakdownTrips, { color: colors.textSecondary }]}
          >
            {trips} trips
          </Text>
        </View>
        <View style={styles.breakdownAmount}>
          <Text style={[styles.breakdownAmountText, { color: colors.text }]}>
            {formatCurrency(amount)}
          </Text>
          <ArrowRight size={16} color={colors.gray} />
        </View>
      </View>
    );
  }
);

export default function EarningsScreen() {
  const { colors } = useTheme();
  const { driver } = useAuthStore(); // Lấy driver từ store
  const { daily, weekly, monthly, fetchEarnings } = useEarnings();

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEarnings();
    setRefreshing(false);
  }, [fetchEarnings]);

  const renderBreakdownContent = useCallback(() => {
    const titleMap = {
      daily: "Daily Earnings",
      weekly: "Weekly Earnings",
      monthly: "Monthly Earnings",
    };

    const iconMap = {
      daily: <Calendar size={20} color={colors.primary} />,
      weekly: <Calendar size={20} color={colors.primary} />,
      monthly: <TrendingUp size={20} color={colors.primary} />,
    };

    const dataMap = {
      daily,
      weekly,
      monthly,
    };

    return (
      <>
        <View
          style={[styles.breakdownHeader, { borderBottomColor: colors.border }]}
        >
          <Text style={[styles.breakdownTitle, { color: colors.text }]}>
            {titleMap[activeTab]}
          </Text>
          {iconMap[activeTab]}
        </View>
        {dataMap[activeTab].map((item: { date: string; trips: number; amount: number; }, index: React.Key | null | undefined) => (
          <BreakdownItem
            key={index}
            date={item.date}
            trips={item.trips}
            amount={item.amount}
          />
        ))}
      </>
    );
  }, [activeTab, daily, weekly, monthly, colors]);

  if (!driver) return null;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["bottom"]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Earnings</Text>
        </View>

        <View style={styles.summaryContainer}>
          <EarningsCard amount={driver.earnings.today} period="today" />
          <View style={styles.earningsRow}>
            <EarningsCard amount={driver.earnings.week} period="week" />
            <EarningsCard amount={driver.earnings.month} period="month" />
          </View>
          <EarningsCard amount={driver.earnings.total} period="total" />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Earnings Breakdown
          </Text>

          <View
            style={[styles.tabContainer, { backgroundColor: colors.darkGray }]}
          >
            <TabButton
              title="Daily"
              isActive={activeTab === "daily"}
              onPress={() => setActiveTab("daily")}
            />
            <TabButton
              title="Weekly"
              isActive={activeTab === "weekly"}
              onPress={() => setActiveTab("weekly")}
            />
            <TabButton
              title="Monthly"
              isActive={activeTab === "monthly"}
              onPress={() => setActiveTab("monthly")}
            />
          </View>

          <Card style={styles.breakdownCard} colors={colors}>
            {renderBreakdownContent()}
          </Card>
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
    marginBottom: Layout.spacing.l,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  summaryContainer: {
    marginBottom: Layout.spacing.xl,
  },
  earningsRow: {
    flexDirection: "row",
    gap: Layout.spacing.m,
    marginVertical: Layout.spacing.m,
  },
  detailsContainer: {
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Layout.spacing.m,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: Layout.spacing.m,
    borderRadius: Layout.borderRadius.medium,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Layout.spacing.m,
    alignItems: "center",
    borderRadius: Layout.borderRadius.small,
  },
  tabText: {
    fontWeight: "500",
  },
  breakdownCard: {
    padding: 0,
    overflow: "hidden",
  },
  breakdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Layout.spacing.ml,
    borderBottomWidth: 1,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  breakdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Layout.spacing.ml,
    borderBottomWidth: 1,
  },
  breakdownDate: {
    fontSize: 14,
    marginBottom: 2,
  },
  breakdownTrips: {
    fontSize: 12,
  },
  breakdownAmount: {
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.spacing.m,
  },
  breakdownAmountText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
