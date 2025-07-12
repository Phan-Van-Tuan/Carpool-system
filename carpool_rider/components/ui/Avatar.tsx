import React from "react";
import { View, Image, StyleSheet, ImageSourcePropType } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/color";
import { Text } from "./Text";

interface AvatarProps {
  source?: ImageSourcePropType;
  name?: string;
  size?: number;
  style?: any;
}

export function Avatar({ source, name, size = 40, style }: AvatarProps) {
  const { theme } = useThemeStore();
  const colors = getColors(theme);

  const getInitials = () => {
    if (!name) return "";

    const nameParts = name.split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  const getRandomColor = () => {
    const avatarColors = [
      "#1abc9c",
      "#2ecc71",
      "#3498db",
      "#9b59b6",
      "#34495e",
      "#16a085",
      "#27ae60",
      "#2980b9",
      "#8e44ad",
      "#2c3e50",
      "#f1c40f",
      "#e67e22",
      "#e74c3c",
      "#ecf0f1",
      "#95a5a6",
    ];

    // Use the name to generate a consistent color
    if (name) {
      const charCodeSum = name
        .split("")
        .reduce((sum, char) => sum + char.charCodeAt(0), 0);
      return avatarColors[charCodeSum % avatarColors.length];
    }

    // Fallback to a random color
    return avatarColors[Math.floor(Math.random() * avatarColors.length)];
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: source ? "transparent" : getRandomColor(),
        },
        style,
      ]}
    >
      {source ? (
        <Image
          source={source}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />
      ) : (
        <Text
          variant={size > 60 ? "h2" : size > 40 ? "h3" : "body"}
          color="#ffffff"
          center
        >
          {getInitials()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
