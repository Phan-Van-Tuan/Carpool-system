import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/color";
import { Text, Avatar, Card, Rating } from "@/components/ui";
import { User } from "@/types";
import { Edit2 } from "lucide-react-native";
import layout from "@/constants/layout";
import { useTranslation } from "@/constants/i18n";
import { toRgba } from "@/lib/utils";

interface ProfileHeaderProps {
  user: User | null;
  onEditPress: () => void;
}

export function ProfileHeader({ user, onEditPress }: ProfileHeaderProps) {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { t } = useTranslation();

  if (!user) {
    return null;
  }

  return (
    <Card
      variant="flat"
      style={[
        styles.container,
        { backgroundColor: `${colors.theme.border}40` },
      ]}
    >
      <View style={styles.profileCard}>
        <Image
          source={{
            uri:
              user?.avatar ||
              "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
          }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text variant="h3" color={colors.theme.text} style={styles.name}>
            {user.lastName} {user.firstName}
          </Text>
          <Text variant="bodySmall" color={colors.theme.textSecondary}>
            {user.phone}
          </Text>
          <Text variant="bodySmall" color={colors.theme.textSecondary}>
            {user.email}
          </Text>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Edit2 size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 88,
    marginBottom: layout.spacing.m,
    paddingHorizontal: layout.spacing.xs,
    paddingVertical: layout.spacing.s,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: layout.spacing.m,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    position: "relative",
  },
  editButton: {
    borderRadius: 100,
    padding: layout.spacing.s,
  },
  userInfo: {
    alignItems: "center",
    marginTop: layout.spacing.m,
  },
  name: {
    marginBottom: 0,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: layout.spacing.m,
    paddingTop: layout.spacing.m,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  divider: {
    width: 1,
    height: "80%",
    alignSelf: "center",
  },
});
