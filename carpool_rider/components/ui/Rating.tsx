import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { Star } from "lucide-react-native";
import { getColors } from "@/constants/color";

interface RatingProps {
  value: number;
  maxValue?: number;
  size?: "small" | "medium" | "large";
  readonly?: boolean;
  onChange?: (value: number) => void;
}

export function Rating({
  value,
  maxValue = 5,
  size = "medium",
  readonly = false,
  onChange,
}: RatingProps) {
  const { theme } = useThemeStore();
  const colors = getColors(theme);

  const getStarSize = () => {
    switch (size) {
      case "small":
        return 16;
      case "large":
        return 32;
      default: // medium
        return 24;
    }
  };

  const handlePress = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const renderStars = () => {
    const starSize = getStarSize();
    const stars = [];

    for (let i = 1; i <= maxValue; i++) {
      const isFilled = i <= Math.floor(value);
      const isHalfFilled =
        !isFilled && i === Math.ceil(value) && value % 1 !== 0;

      stars.push(
        <TouchableOpacity
          key={i}
          style={styles.starContainer}
          onPress={() => handlePress(i)}
          disabled={readonly}
          activeOpacity={readonly ? 1 : 0.7}
        >
          <Star
            size={starSize}
            color={
              isFilled || isHalfFilled
                ? colors.theme.warning
                : colors.theme.border
            }
            fill={isFilled ? colors.theme.warning : "transparent"}
          />
        </TouchableOpacity>
      );
    }

    return stars;
  };

  return <View style={styles.container}>{renderStars()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  starContainer: {
    padding: 2,
  },
});
