import React, { memo, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TrendingUp, Calendar, Clock } from "lucide-react-native";
import Layout from "@/constants/layout";
import { useTheme } from "@/contexts/ThemeContext";

interface EarningsCardProps {
  amount: number;
  period: "today" | "week" | "month" | "total";
  trips?: number;
}

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

const getTitle = (period: EarningsCardProps["period"]): string => {
  switch (period) {
    case "today":
      return "Today's Earnings";
    case "week":
      return "This Week";
    case "month":
      return "This Month";
    case "total":
      return "Total Earnings";
  }
};

const getIcon = (period: EarningsCardProps["period"], color: string) => {
  switch (period) {
    case "today":
      return <Clock size={24} color={color} />;
    case "week":
    case "month":
      return <Calendar size={24} color={color} />;
    case "total":
      return <TrendingUp size={24} color={color} />;
  }
};

const EarningsCard: React.FC<EarningsCardProps> = ({
  amount,
  period,
  trips,
}) => {
  const { colors } = useTheme();

  const styles = useMemo(() => createStyles(colors), [colors]);
  const title = getTitle(period);
  const icon = getIcon(period, colors.primary);
  const formattedAmount = formatCurrency(amount);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.amount}>{formattedAmount}</Text>
        {trips !== undefined && <Text style={styles.trips}>{trips} trips</Text>}
      </View>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: Layout.borderRadius.medium,
      padding: Layout.spacing.m,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.darkGray,
      justifyContent: "center",
      alignItems: "center",
      marginRight: Layout.spacing.m,
    },
    content: {
      flex: 1,
    },
    title: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 4,
    },
    amount: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 2,
    },
    trips: {
      color: colors.textSecondary,
      fontSize: 12,
    },
  });

export default memo(EarningsCard);
