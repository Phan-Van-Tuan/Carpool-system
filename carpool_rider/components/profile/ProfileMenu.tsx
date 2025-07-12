import React, { ReactNode } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/color";
import { Text, Card } from "@/components/ui";
import { ChevronRight } from "lucide-react-native";
import layout from "@/constants/layout";

interface MenuItem {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

interface ProfileMenuProps {
  items: MenuItem[];
}

export function ProfileMenu({ items }: ProfileMenuProps) {
  const { theme } = useThemeStore();
  const colors = getColors(theme);

  return (
    <Card variant="flat" style={styles.container}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <TouchableOpacity
            style={[
              styles.menuItem,
              {
                backgroundColor: `${colors.theme.border}40`,
                borderBottomColor: colors.theme.border,
              },
            ]}
            onPress={item.onPress}
          >
            <View
              style={[
                styles.menuIcon,
                { backgroundColor: `${colors.primary}20` },
              ]}
            >
              {item.icon}
            </View>
            <Text style={[styles.menuText, { color: colors.theme.text }]}>
              {item.title}
            </Text>
            <ChevronRight size={20} color={colors.theme.textSecondary} />
          </TouchableOpacity>
        </React.Fragment>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    overflow: "hidden",
  },
  iconContainer: {
    marginRight: layout.spacing.m,
  },
  textContainer: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginHorizontal: layout.spacing.m,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: layout.spacing.ms,
    paddingHorizontal: layout.spacing.m,
    borderBottomWidth: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: layout.spacing.m,
  },
  menuText: {
    flex: 1,
    fontSize: layout.spacing.m,
  },
});
