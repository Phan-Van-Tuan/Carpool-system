// components/PaymentCard.tsx
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Card, Input, Text } from "../ui";
import layout from "@/constants/layout";
import { ReactNode } from "react";
import { formatMoney, toRgba } from "@/lib/utils";

type PM = "cash" | "vnpay" | "momo";

interface Props {
  paymentMethod: PM;
  setPaymentMethod: (method: PM) => void;
  note: string;
  setNote: (text: string) => void;
  total: number;
  colors: any;
  t: (key: string) => string;
}

export const PaymentCard = ({
  paymentMethod,
  setPaymentMethod,
  note,
  setNote,
  total,
  colors,
  t,
}: Props) => {
  return (
    <Card variant="elevated" style={styles.paymentCard}>
      <Text variant="h3" color={colors.theme.text} style={styles.cardTitle}>
        {t("booking.paymentMethod")}
      </Text>

      <View style={styles.paymentOptions}>
        <PaymentItem
          active={paymentMethod}
          method={"cash"}
          title={t("booking.cash")}
          onChoose={(val) => setPaymentMethod(val)}
          colors={colors}
          icon={
            <Image
              source={require("@/assets/images/dollar.png")}
              style={styles.paymentIcon}
            />
          }
        />

        <PaymentItem
          active={paymentMethod}
          method={"vnpay"}
          title={t("booking.card")}
          onChoose={(val) => setPaymentMethod(val)}
          colors={colors}
          icon={
            <Image
              source={require("@/assets/images/vnpay.png")}
              style={styles.paymentIcon}
            />
          }
        />

        <PaymentItem
          active={paymentMethod}
          method={"momo"}
          title={t("booking.wallet")}
          onChoose={(val) => setPaymentMethod(val)}
          colors={colors}
          icon={
            <Image
              source={require("@/assets/images/momo.png")}
              style={styles.paymentIcon}
            />
          }
        />
      </View>

      <Input
        value={note}
        onChangeText={setNote}
        placeholder={t("input.noteForDriver")}
        style={{
          paddingLeft: layout.spacing.m,
          color: colors.theme.textSecondary,
        }}
      />
      <View style={[styles.priceRow, styles.totalRow]}>
        <Text variant="body" color={colors.theme.text} weight="600">
          {t("booking.total")}
        </Text>
        <Text variant="h3" color={colors.primary}>
          {formatMoney(total)}
        </Text>
      </View>
    </Card>
  );
};

function PaymentItem({
  active,
  method,
  title,
  onChoose,
  colors,
  icon,
}: {
  active: string;
  method: PM;
  title: string;
  onChoose: (val: PM) => void;
  colors: any;
  icon: ReactNode;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.paymentOption,
        method === active && {
          borderColor: colors.primary,
          backgroundColor: toRgba(colors.primary, 0.1),
        },
      ]}
      onPress={() => onChoose(method)}
    >
      {icon}
      <Text
        variant="body"
        color={method === active ? colors.primary : colors.theme.text}
        style={styles.paymentText}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    marginBottom: layout.spacing.m,
  },
  paymentCard: {
    marginBottom: layout.spacing.xl,
    borderRadius: layout.borderRadius.medium,
  },
  paymentOptions: {
    justifyContent: "space-between",
    marginBottom: layout.spacing.l,
  },
  paymentOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: layout.spacing.m,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: layout.borderRadius.medium,
    marginVertical: layout.spacing.xs,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  paymentIcon: {
    width: 50,
    height: 50,
  },
  paymentText: {
    marginLeft: layout.spacing.l,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: layout.spacing.s,
  },
  totalRow: {
    marginTop: layout.spacing.m,
    paddingTop: layout.spacing.m,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
});
