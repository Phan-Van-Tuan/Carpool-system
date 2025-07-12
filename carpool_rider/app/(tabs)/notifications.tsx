import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { useNotificationStore } from "@/store/notificationStore";
import { Text, Button, Spinner } from "@/components/ui";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Bell, Trash2 } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getColors } from "@/constants/color";
import { useTranslation } from "@/constants/i18n";
import layout from "@/constants/layout";
import { Swipeable } from "react-native-gesture-handler";
import { formatDate } from "@/lib/utils";

export default function NotificationsScreen() {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { t } = useTranslation();
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotificationStore();


  const handleRefresh = () => {
    // fetchNotifications();
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    clearAll();
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Bell size={60} color={colors.theme.textSecondary} />
      <Text variant="h3" color={colors.theme.text} style={styles.emptyTitle}>
        {t("notifications.noNotifications")}
      </Text>
      <Text
        variant="body"
        color={colors.theme.textSecondary}
        style={styles.emptySubtitle}
      >
        {t("notifications.emptyMessage")}
      </Text>
    </View>
  );

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => deleteNotification(id)}
    >
      <Text style={{ color: "#fff" }}>Xóa</Text>
    </TouchableOpacity>
  );

  if (isLoading && notifications.length === 0) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.theme.background },
        ]}
      >
        <Spinner size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.theme.background }]}
      edges={["bottom"]}
    >
      {unreadCount > 0 && (
        <View style={styles.header}>
          <Text variant="body" color={colors.theme.textSecondary}>
            {unreadCount + " "}
            {t("notifications.unreadCount")}
          </Text>
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text variant="body" color={colors.primary} weight="600">
              {t("notifications.markAllAsRead")}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item.id)}>
            <TouchableOpacity
              style={[styles.item, !item.isRead && styles.unread]}
              onPress={() => markAsRead(item.id)}
            >
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemContent}>{item.content}</Text>
              <Text style={styles.itemDate}>{formatDate(item.createdAt)}</Text>
            </TouchableOpacity>
          </Swipeable>
        )}
        contentContainerStyle={[
          styles.listContent,
          notifications.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />

      {notifications.length > 0 && (
        <View style={styles.footer}>
          <Button
            title={t("notifications.clearAll")}
            onPress={handleClearAll}
            variant="outline"
            icon={<Trash2 size={18} color={colors.theme.text} />}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: layout.spacing.m,
    paddingVertical: layout.spacing.s,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: layout.spacing.m,
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: layout.spacing.xl,
  },
  emptyTitle: {
    marginTop: layout.spacing.l,
    marginBottom: layout.spacing.s,
  },
  emptySubtitle: {
    textAlign: "center",
  },
  footer: {
    padding: layout.spacing.m,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  item: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  unread: {
    backgroundColor: "#e6f0ff",
  },
  itemTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  itemContent: { color: "#444", marginBottom: 4 },
  itemDate: { color: "#888", fontSize: 12 },
  deleteButton: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
});
