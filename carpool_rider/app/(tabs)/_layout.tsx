import React, { use, useEffect } from "react";
import { Tabs } from "expo-router";
import { useThemeStore } from "@/store/themeStore";
import { Home, Clock, Bell, User } from "lucide-react-native";
import { useNotificationStore } from "@/store/notificationStore";
import { Badge } from "@/components/ui";
import { View } from "react-native";
import { getColors } from "@/constants/color";
import { useTranslation } from "@/constants/i18n";
import { useTripSocket } from "@/services/socket";

export default function TabLayout() {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { t } = useTranslation();
  const { unreadCount } = useNotificationStore();
  const { isConnected } = useTripSocket();

  useEffect(() => {
    console.log("Socket connection status:", isConnected);
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.theme.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.theme.background,
          borderTopColor: colors.theme.border,
        },
        headerStyle: {
          backgroundColor: colors.theme.background,
        },
        headerTintColor: colors.theme.text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("common.home"),
          // headerShown: false,
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: t("trips.myTrips"),
          // headerShown: false,
          tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: t("notifications.notifications"),
          // headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <View>
              <Bell size={size} color={color} />
              {unreadCount > 0 && (
                <Badge
                  count={unreadCount}
                  variant="primary"
                  size="small"
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -10,
                  }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("profile.profile"),
          // headerShown: false,
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
