import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";
import Layout from "@/constants/layout";

interface ProfileItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightContent?: React.ReactNode;
  colors: any; // Pass theme colors
}

const ProfileItem: React.FC<ProfileItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  rightContent,
  colors,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: colors.darkGray }]}
      >
        {icon}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightContent ? (
        <View style={styles.rightContent}>{rightContent}</View>
      ) : (
        showChevron && <ChevronRight size={20} color={colors.gray} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Layout.spacing.ml,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Layout.spacing.m,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "400",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  rightContent: {
    marginLeft: Layout.spacing.s,
  },
});

// Memoize the component to prevent unnecessary re-renders
export default memo(ProfileItem);
