import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { Text, Card, Switch, Divider, Modal, Button } from "@/components/ui";
import {
  Globe,
  Moon,
  Bell,
  Info,
  FileText,
  Trash2,
  ChevronRight,
} from "lucide-react-native";
import { LanguageSelector } from "@/components/profile/LanguageSelector";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import { useTranslation } from "@/constants/i18n";
import { getColors } from "@/constants/color";
import layout from "@/constants/layout";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const colors = getColors(theme);
  const { logout } = useAuthStore();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleToggleTheme = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleTheme();
  };

  const handleToggleNotifications = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleLanguagePress = () => {
    setShowLanguageModal(true);
  };

  const handleDeleteAccount = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // In a real app, this would delete the account
    await logout();
    router.replace("/auth/login");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.theme.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.settingsCard}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleLanguagePress}
          >
            <View style={styles.settingLeft}>
              <Globe size={24} color={colors.primary} />
              <Text variant="body" style={styles.settingText}>
                {t("profile.language")}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.theme.textSecondary} />
          </TouchableOpacity>

          <Divider />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Moon size={24} color={colors.primary} />
              <Text variant="body" style={styles.settingText}>
                {t("profile.darkMode")}
              </Text>
            </View>
            <Switch
              value={theme === "dark"}
              onValueChange={handleToggleTheme}
            />
          </View>

          <Divider />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={24} color={colors.primary} />
              <Text variant="body" style={styles.settingText}>
                {t("profile.notifications")}
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
            />
          </View>
        </Card>

        <Card style={styles.settingsCard}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push("/help")}
          >
            <View style={styles.settingLeft}>
              <Info size={24} color={colors.primary} />
              <Text variant="body" style={styles.settingText}>
                {t("profile.about")}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.theme.textSecondary} />
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push("/help")}
          >
            <View style={styles.settingLeft}>
              <FileText size={24} color={colors.primary} />
              <Text variant="body" style={styles.settingText}>
                {t("profile.privacyPolicy")}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.theme.textSecondary} />
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push("/help")}
          >
            <View style={styles.settingLeft}>
              <FileText size={24} color={colors.primary} />
              <Text variant="body" style={styles.settingText}>
                {t("profile.termsConditions")}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.theme.textSecondary} />
          </TouchableOpacity>
        </Card>

        <TouchableOpacity
          style={styles.deleteAccount}
          onPress={() => setShowDeleteModal(true)}
        >
          <Trash2 size={20} color={colors.theme.error} />
          <Text
            variant="body"
            color={colors.theme.error}
            style={styles.deleteText}
          >
            {t("profile.deleteAccount")}
          </Text>
        </TouchableOpacity>

        <Text
          variant="caption"
          center
          color={colors.theme.textSecondary}
          style={styles.version}
        >
          {t("profile.version")} 1.0.0
        </Text>
      </ScrollView>

      <Modal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        title={t("profile.language")}
      >
        <LanguageSelector
          currentLanguage="en"
          onSelectLanguage={() => {}}
          // onClose={() => setShowLanguageModal(false)}
        />
      </Modal>

      <Modal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t("profile.deleteAccount")}
      >
        <Text variant="body" style={styles.deleteModalText}>
          {t("profile.deleteConfirmation")}
        </Text>

        <Text
          variant="body"
          color={colors.theme.error}
          style={styles.deleteModalText}
        >
          This action cannot be undone.
        </Text>

        <View style={styles.deleteModalButtons}>
          <Button
            title={t("common.cancel")}
            onPress={() => setShowDeleteModal(false)}
            variant="outline"
            style={styles.deleteModalButton}
          />
          <Button
            title={t("common.delete")}
            onPress={handleDeleteAccount}
            variant="ghost"
            style={styles.deleteModalButton}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: layout.spacing.l,
  },
  settingsCard: {
    marginBottom: layout.spacing.m,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: layout.spacing.m,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    marginLeft: layout.spacing.m,
  },
  deleteAccount: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: layout.spacing.m,
    marginTop: layout.spacing.l,
  },
  deleteText: {
    marginLeft: layout.spacing.s,
    fontWeight: "600",
  },
  version: {
    marginTop: layout.spacing.xl,
  },
  deleteModalText: {
    marginBottom: layout.spacing.m,
  },
  deleteModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: layout.spacing.m,
  },
  deleteModalButton: {
    flex: 0.48,
  },
});
