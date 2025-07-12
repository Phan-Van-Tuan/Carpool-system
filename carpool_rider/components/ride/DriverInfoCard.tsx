// components/DriverInfoCard.tsx
import { View, Image } from "react-native";
import { Star } from "lucide-react-native";
import { Card, Text } from "../ui";

interface Props {
  driver: {
    avatar?: string;
    name: string;
    rating: number;
    vehicle: string;
    plate: string;
  };
  colors: any;
  t: (key: string) => string;
}

export const DriverInfoCard = ({ driver, colors, t }: Props) => {
  return (
    <Card
      variant="elevated"
      style={{ padding: 16, borderRadius: 12, marginBottom: 16 }}
    >
      <Text variant="h3" style={{ marginBottom: 12 }} color={colors.theme.text}>
        {t("booking.driverInfo")}
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Image
          source={{ uri: driver.avatar || "https://via.placeholder.com/60" }}
          style={{ width: 60, height: 60, borderRadius: 30 }}
        />
        <View>
          <Text variant="body" color={colors.theme.text}>
            {driver.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Star size={14} color={colors.yellow[500]} />
            <Text variant="bodySmall" color={colors.yellow[500]}>
              {driver.rating.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 12 }}>
        <Text variant="bodySmall" color={colors.theme.textSecondary}>
          {t("booking.vehicle")}
        </Text>
        <Text variant="body" color={colors.theme.text}>
          {driver.vehicle} – {driver.plate}
        </Text>
      </View>
    </Card>
  );
};
