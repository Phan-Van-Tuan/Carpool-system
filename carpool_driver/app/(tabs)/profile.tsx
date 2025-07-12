import React, { useState, useCallback, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Platform,
  TextInput,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  User,
  Car,
  FileText,
  Star,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Shield,
  CreditCard,
  Languages,
  Moon,
  Code,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { LanguageCode, useLanguage } from "@/contexts/LanguageContext";
import ProfileItem from "@/components/ProfileItem";
import Button from "@/components/Button";
import Layout from "@/constants/layout";
import { CustomModal, LanguageSelectionModal } from "@/components/Modal";
import { showComingSoonAlert } from "@/utils/dev";
import { useAuthStore } from "@/store/auth-store";

// Memoized profile item component
const MemoizedProfileItem = memo(ProfileItem);

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isDark, setTheme } = useTheme();
  const { driver, logout } = useAuthStore();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const { t, language, setLanguage, availableLanguages } = useLanguage();

  const [notifications, setNotifications] = useState(true);

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const handleLogout = useCallback(() => {
    const el = async () => {
      await logout();
      setLogoutModalVisible(false);
      router.replace("/auth/login");
    };
    el();
  }, [logout, router, t]);

  const handlePickImage = useCallback(async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(t("somethingWentWrong"), t("locationPermissionMessage"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      // In a real app, you would upload this image to your server
      // and update the user's profile
      Alert.alert(t("success"), t("profilePictureUpdated"));
    }
  }, [t]);

  const handleToggleNotifications = useCallback((value: boolean) => {
    setNotifications(value);
  }, []);

  const handleToggleDarkMode = useCallback(
    (value: boolean) => {
      setTheme(value ? "dark" : "light");
    },
    [setTheme]
  );

  if (!driver) return null;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={handlePickImage}>
          <Image
            source={{
              uri:
                driver.account.avatar ||
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
            }}
            style={styles.profileImage}
            contentFit="cover"
          />
          <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.editBadgeText, { color: colors.white }]}>
              {t("edit")}
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={[styles.profileName, { color: colors.text }]}>
          {driver.account.lastName} {driver.account.firstName}
        </Text>
        <View style={styles.ratingContainer}>
          <Star size={16} color={colors.warning} fill={colors.warning} />
          <Text style={[styles.rating, { color: colors.textSecondary }]}>
            {driver.account.rating?.toFixed(1) || 5} •{" "}
            {driver.account.totalTrips || 0} {t("trips")}
          </Text>
        </View>
        <Text style={[styles.joinDate, { color: colors.textSecondary }]}>
          {t("driverSince")}{" "}
          {new Date(driver.account.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t("account")}
        </Text>

        <MemoizedProfileItem
          icon={<User size={20} color={colors.primary} />}
          title={t("personalInformation")}
          subtitle={t("updatePersonalDetails")}
          onPress={showComingSoonAlert}
          colors={colors}
        />

        <MemoizedProfileItem
          icon={<Car size={20} color={colors.primary} />}
          title={t("vehicleInformation")}
          subtitle={`${driver.vehicle?.make} ${driver.vehicle?.vehicleModel} • ${driver.vehicle?.licensePlate}`}
          onPress={showComingSoonAlert}
          colors={colors}
        />

        <MemoizedProfileItem
          icon={<FileText size={20} color={colors.primary} />}
          title={t("documents")}
          subtitle={`${
            driver.documents.documents.filter((d) => d.status === "verified")
              .length
          }/${driver.documents.documents.length} ${t("verified")}`}
          onPress={showComingSoonAlert}
          colors={colors}
        />
      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t("preferences")}
        </Text>
        <MemoizedProfileItem
          icon={<Settings size={20} color={colors.primary} />}
          title={t("settings")}
          subtitle={t("appSettingsPreferences")}
          onPress={showComingSoonAlert}
          colors={colors}
        />

        <MemoizedProfileItem
          icon={<Bell size={20} color={colors.primary} />}
          title={t("notifications")}
          showChevron={false}
          rightContent={
            <Switch
              value={notifications}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: colors.gray, true: colors.primary }}
              thumbColor={
                Platform.OS === "ios"
                  ? colors.white
                  : notifications
                  ? colors.white
                  : colors.lightGray
              }
            />
          }
          colors={colors}
        />

        <MemoizedProfileItem
          icon={<Moon size={20} color={colors.primary} />}
          title={t("darkMode")}
          showChevron={false}
          rightContent={
            <Switch
              value={isDark}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: colors.gray, true: colors.primary }}
              thumbColor={
                Platform.OS === "ios"
                  ? colors.white
                  : isDark
                  ? colors.white
                  : colors.lightGray
              }
            />
          }
          colors={colors}
        />

        <MemoizedProfileItem
          icon={<Languages size={20} color={colors.primary} />}
          title={t("language")}
          subtitle={
            availableLanguages.find((lang) => lang.code === language)?.name ||
            "English"
          }
          onPress={() => {
            setLanguageModalVisible(true);
          }}
          colors={colors}
        />
      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t("payment")}
        </Text>

        <MemoizedProfileItem
          icon={<CreditCard size={20} color={colors.primary} />}
          title={t("paymentMethods")}
          subtitle={t("addRemovePaymentMethods")}
          onPress={showComingSoonAlert}
          colors={colors}
        />
      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t("support")}
        </Text>

        <MemoizedProfileItem
          icon={<HelpCircle size={20} color={colors.primary} />}
          title={t("helpCenter")}
          subtitle={t("getHelpWithAccount")}
          onPress={showComingSoonAlert}
          colors={colors}
        />

        <MemoizedProfileItem
          icon={<Shield size={20} color={colors.primary} />}
          title={t("safetyCenter")}
          subtitle={t("learnAboutSafetyFeatures")}
          onPress={showComingSoonAlert}
          colors={colors}
        />

        <MemoizedProfileItem
          icon={<Code size={20} color={colors.primary} />}
          title={t("aboutMe")}
          subtitle={t("subAboutMe")}
          onPress={showComingSoonAlert}
          colors={colors}
        />
      </View>
      <Button
        title={t("logout")}
        variant="outline"
        leftIcon={<LogOut size={20} color={colors.danger} />}
        style={
          (styles.logoutButton,
          {
            backgroundColor: `${colors.danger}15`,
          })
        }
        textStyle={{ color: colors.danger }}
        onPress={() => setLogoutModalVisible(true)}
        colors={colors}
      />
      <Text style={[styles.versionText, { color: colors.textSecondary }]}>
        {` `}
        {t("version")} 1.0.0{`\n`}Jpatrick © 2025
      </Text>
      {/* modal */}
      <LanguageSelectionModal
        isVisible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        onSelect={(code: LanguageCode) => {
          setLanguage(code);
        }}
        languages={availableLanguages}
        selectedLanguage={language}
      />
      <CustomModal
        isVisible={logoutModalVisible}
        onClose={() => {
          setLogoutModalVisible(false);
        }}
        title={t("logout")}
        footerButtons={[
          {
            text: t("cancel"),
            onPress: () => {
              setLogoutModalVisible(false);
            },
            type: "secondary",
          },
          {
            text: t("confirm"),
            onPress: handleLogout,
            type: "primary",
          },
        ]}
      >
        <Text style={{ padding: Layout.spacing.l }}>{t("areYouSure")}</Text>
      </CustomModal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Layout.spacing.l,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: Layout.spacing.xl,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Layout.spacing.m,
  },
  editBadge: {
    position: "absolute",
    bottom: Layout.spacing.m,
    right: 0,
    paddingHorizontal: Layout.spacing.s,
    paddingVertical: 2,
    borderRadius: Layout.spacing.xs,
  },
  editBadgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: Layout.spacing.xs,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: Layout.spacing.xs,
  },
  rating: {
    fontSize: 14,
  },
  joinDate: {
    fontSize: 12,
  },
  section: {
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Layout.spacing.m,
  },
  logoutButton: {},
  versionText: {
    marginTop: Layout.spacing.xl,
    textAlign: "center",
    fontSize: 12,
    marginBottom: Layout.spacing.m,
  },
});
