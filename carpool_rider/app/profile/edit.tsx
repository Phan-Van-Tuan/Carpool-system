import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/color";
import { Text, Input, Button, ErrorMessage } from "@/components/ui";
import layout from "@/constants/layout";
import { useAuthStore } from "@/store/authStore";
import { User, Mail, Phone, Camera } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useTranslation } from "@/constants/i18n";

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { user, updateUser, error, clearError, isLoading } = useAuthStore();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const validateForm = () => {
    let isValid = true;

    // Reset errors
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPhoneError("");

    // Validate first name
    if (!firstName) {
      setFirstNameError(t("errors.requiredField"));
      isValid = false;
    }

    // Validate last name
    if (!lastName) {
      setLastNameError(t("errors.requiredField"));
      isValid = false;
    }

    // Validate email
    if (!email) {
      setEmailError(t("errors.requiredField"));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t("errors.invalidEmail"));
      isValid = false;
    }

    // Validate phone
    if (!phone) {
      setPhoneError(t("errors.requiredField"));
      isValid = false;
    } else if (!/^\+?[0-9]{10,15}$/.test(phone)) {
      setPhoneError(t("errors.invalidPhone"));
      isValid = false;
    }

    return isValid;
  };

  const handleUpdateProfile = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (validateForm()) {
      await updateUser({
        firstName,
        lastName,
        email,
        phone,
        avatar,
      });

      // Navigate back after successful update
      router.back();
    }
  };

  const handlePickImage = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert(
        "Sorry, we need camera roll permissions to change your profile picture!"
      );
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
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
        {error && (
          <ErrorMessage
            message={error}
            // onRetry={() => clearError()}
          />
        )}

        <View style={styles.avatarContainer}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: colors.primary },
              ]}
            >
              <User size={48} color="#ffffff" />
            </View>
          )}

          <TouchableOpacity
            style={[styles.cameraButton, { backgroundColor: colors.primary }]}
            onPress={handlePickImage}
          >
            <Camera size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <Input
              label={t("auth.firstName")}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="John"
              leftIcon={<User size={20} />}
              error={firstNameError}
              style={styles.nameInput}
            />

            <Input
              label={t("auth.lastName")}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Doe"
              leftIcon={<User size={20} />}
              error={lastNameError}
              style={styles.nameInput}
            />
          </View>

          <Input
            label={t("auth.email")}
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} />}
            error={emailError}
          />

          <Input
            label={t("auth.phone")}
            value={phone}
            onChangeText={setPhone}
            placeholder="+84123456789"
            keyboardType="phone-pad"
            leftIcon={<Phone size={20} />}
            error={phoneError}
          />

          <Button
            title={t("common.save")}
            onPress={handleUpdateProfile}
            loading={isLoading}
            // fullWidth
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
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
  avatarContainer: {
    alignItems: "center",
    marginBottom: layout.spacing.xl,
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: "100%",
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameInput: {
    flex: 0.48,
  },
  saveButton: {
    marginTop: layout.spacing.m,
  },
});
