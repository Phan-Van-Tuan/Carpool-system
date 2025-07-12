import React, { useEffect, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import Layout from "@/constants/layout";

interface StatusToggleProps {
  isOnline: boolean;
  onToggle: () => void;
  disabled?: boolean;
  colors: any; // Pass theme colors
}

const StatusToggle: React.FC<StatusToggleProps> = ({
  isOnline,
  onToggle,
  disabled = false,
  colors,
}) => {
  const translateX = new Animated.Value(isOnline ? 1 : 0);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOnline ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOnline, translateX]);

  const togglePosition = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 36],
  });

  return (
    <TouchableOpacity
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.8}
      style={styles.container}
    >
      <View
        style={[
          styles.toggle,
          {
            backgroundColor: isOnline ? colors.success : colors.gray,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.toggleButton,
            {
              backgroundColor: colors.white,
              transform: [{ translateX: togglePosition }],
            },
          ]}
        />
      </View>
      <Text
        style={[
          styles.status,
          {
            color: isOnline ? colors.success : colors.gray,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {isOnline ? "Online" : "Offline"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.spacing.s,
  },
  toggle: {
    width: 60,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
  },
  toggleButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
  },
});

// Memoize the component to prevent unnecessary re-renders
export default memo(StatusToggle);
