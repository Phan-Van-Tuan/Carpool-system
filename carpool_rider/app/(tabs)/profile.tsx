import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/color";
import { useTranslation } from "@/constants/i18n";
import { useAuthStore } from "@/store/authStore";
import { Text, Card, Button } from "@/components/ui";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileMenu } from "@/components/profile/ProfileMenu";
import { LanguageSelector } from "@/components/profile/LanguageSelector";
import {
  User,
  CreditCard,
  MapPin,
  Settings,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  Car,
  Bell,
  Shield,
  Code,
  Info,
  FileText,
} from "lucide-react-native";
import layout from "@/constants/layout";
import { SafeAreaView } from "react-native-safe-area-context";
import { showComingSoonAlert } from "@/lib/dev";

export default function ProfileScreen() {
  const { theme, toggleTheme } = useThemeStore();
  const colors = getColors(theme);
  const { t, language, changeLanguage } = useTranslation();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.theme.background }]}
      edges={["bottom"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProfileHeader
          user={user}
          onEditPress={() => router.push("/profile/edit")}
        />

        <View style={styles.section}>
          <Text variant="h4" color={colors.primary} style={styles.sectionTitle}>
            {t("profile.accountSettings")}
          </Text>

          <ProfileMenu
            items={[
              {
                icon: <CreditCard size={20} color={colors.primary} />,
                title: t("profile.paymentMethods"),
                onPress: () => {
                  showComingSoonAlert();
                },
                // onPress: () => router.push("/profile/payment-methods"),
              },
              {
                icon: <MapPin size={20} color={colors.primary} />,
                title: t("profile.savedLocations"),
                onPress: () => {
                  showComingSoonAlert();
                },
                // onPress: () => router.push("/profile/saved-locations"),
              },
              {
                icon: <Car size={20} color={colors.primary} />,
                title: t("profile.becomeDriver"),
                onPress: () => {
                  showComingSoonAlert();
                },
                // onPress: () => router.push("/profile/become-driver"),
              },
            ]}
          />
        </View>

        <View style={styles.section}>
          <Text variant="h4" color={colors.primary} style={styles.sectionTitle}>
            {t("profile.preferences")}
          </Text>

          <Card variant="flat" style={styles.preferencesCard}>
            <View
              style={[
                styles.preferenceItem,
                {
                  backgroundColor: `${colors.theme.border}40`,
                  borderBottomColor: colors.theme.border,
                },
              ]}
            >
              <View style={styles.preferenceLeft}>
                <View
                  style={[
                    styles.menuIcon,
                    { backgroundColor: `${colors.primary}20` },
                  ]}
                >
                  <Bell size={20} color={colors.primary} />
                </View>

                <Text
                  variant="body"
                  color={colors.theme.text}
                  style={styles.preferenceText}
                >
                  {t("profile.notification")}
                </Text>
              </View>
              <Switch
                value={false}
                onValueChange={() => {
                  showComingSoonAlert();
                }}
                trackColor={{
                  false: colors.theme.disabled,
                  true: colors.primary,
                }}
                thumbColor={colors.theme.background}
              />
            </View>
            <View
              style={[
                styles.preferenceItem,
                {
                  backgroundColor: `${colors.theme.border}40`,
                  borderBottomColor: colors.theme.border,
                },
              ]}
            >
              <View style={styles.preferenceLeft}>
                <View
                  style={[
                    styles.menuIcon,
                    { backgroundColor: `${colors.primary}20` },
                  ]}
                >
                  {theme === "dark" ? (
                    <Moon size={20} color={colors.primary} />
                  ) : (
                    <Sun size={20} color={colors.primary} />
                  )}
                </View>

                <Text
                  variant="body"
                  color={colors.theme.text}
                  style={styles.preferenceText}
                >
                  {t("profile.darkMode")}
                </Text>
              </View>
              <Switch
                value={theme === "dark"}
                onValueChange={toggleTheme}
                trackColor={{
                  false: colors.theme.disabled,
                  true: colors.primary,
                }}
                thumbColor={colors.theme.background}
              />
            </View>

            <LanguageSelector
              currentLanguage={language}
              onSelectLanguage={changeLanguage}
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Text variant="h4" color={colors.primary} style={styles.sectionTitle}>
            {t("profile.other")}
          </Text>

          <ProfileMenu
            items={[
              {
                icon: <Info size={20} color={colors.primary} />,
                title: t("profile.about"),
                onPress: () => router.push("/profile/about"),
              },
              {
                icon: <FileText size={20} color={colors.primary} />,
                title: t("profile.termsOfService"),
                onPress: () => router.push("/profile/policy"),
              },
              {
                icon: <Shield size={20} color={colors.primary} />,
                title: t("profile.privacyPolicy"),
                onPress: () => router.push("/profile/privacy"),
              },

              {
                icon: <HelpCircle size={20} color={colors.primary} />,
                title: t("help.helpCenter"),
                onPress: () => router.push("/help"),
              },
              // {
              //   icon: <Code size={20} color={colors.primary} />,
              //   title: t("Site Map"),
              //   onPress: () => router.push("/_sitemap"),
              // },
            ]}
          />
        </View>

        <Button
          title={t("auth.logout")}
          onPress={handleLogout}
          variant="outline"
          icon={<LogOut size={20} color={colors.theme.error} />}
          style={[
            styles.logoutButton,
            { backgroundColor: `${colors.theme.error}10` },
          ]}
          textStyle={{
            color: colors.theme.error,
            paddingHorizontal: 10,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 0,
  },
  section: {
    marginBottom: layout.spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: layout.spacing.m,
    marginBottom: layout.spacing.s,
  },
  preferencesCard: {
    // padding: layout.spacing.m,
  },
  preferenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: layout.spacing.ms,
    paddingHorizontal: layout.spacing.m,
    borderBottomWidth: 1,
  },
  preferenceLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  preferenceText: {
    marginLeft: layout.spacing.m,
  },
  logoutButton: {
    margin: layout.spacing.m,
    marginBottom: layout.spacing.xl,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
