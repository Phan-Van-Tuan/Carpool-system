import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/color";
import { Text } from "@/components/ui";
import { Notification } from "@/types";
import { X, Bell, CreditCard, Car, Info, Tag } from "lucide-react-native";
import layout from "@/constants/layout";
import { formatDistanceToNow } from "date-fns";

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
  onDelete: () => void;
}

export function NotificationItem({
  notification,
  onPress,
  onDelete,
}: NotificationItemProps) {
  const { theme } = useThemeStore();
  const colors = getColors(theme);

  const getNotificationIcon = () => {
    switch (notification.type) {
      case "booking":
        return <Car size={24} color={colors.primary} />;
      case "payment":
        return <CreditCard size={24} color={colors.theme.success} />;
      case "system":
        return <Info size={24} color={colors.theme.info} />;
      case "promotion":
        return <Tag size={24} color={colors.theme.warning} />;
      default:
        return <Bell size={24} color={colors.primary} />;
    }
  };

  const formatTime = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: notification.isRead
            ? colors.theme.background
            : theme === "light"
            ? "rgba(46, 204, 113, 0.05)"
            : "rgba(46, 204, 113, 0.1)",
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>{getNotificationIcon()}</View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            variant="bodySmall"
            color={colors.theme.textSecondary}
            style={styles.time}
          >
            {formatTime(notification.createdAt)}
          </Text>
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <X size={16} color={colors.theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text
          variant="body"
          color={colors.theme.text}
          weight={notification.isRead ? "400" : "600"}
          style={styles.title}
        >
          {notification.title}
        </Text>

        <Text
          variant="bodySmall"
          color={colors.theme.textSecondary}
          style={styles.message}
        >
          {notification.content}
        </Text>

        {notification.image && (
          <Image source={{ uri: notification.image }} style={styles.image} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: layout.spacing.m,
    borderRadius: layout.borderRadius.medium,
    marginBottom: layout.spacing.m,
  },
  iconContainer: {
    marginRight: layout.spacing.m,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: layout.spacing.s,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: layout.spacing.xs,
  },
  time: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 4,
  },
  title: {
    marginBottom: layout.spacing.xs,
  },
  message: {
    lineHeight: 20,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: layout.borderRadius.medium,
    marginTop: layout.spacing.m,
  },
});
