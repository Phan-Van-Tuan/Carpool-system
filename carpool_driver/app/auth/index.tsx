import React from "react";
import { View, Text, StyleSheet, Image, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Car, Shield, Clock } from "lucide-react-native";
import Layout from "@/constants/layout";
import Button from "@/components/Button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.background]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.6 }}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1611448746128-7c39e03b71e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
              }}
              style={styles.logo}
            />
            <Text style={[styles.appName, { color: colors.white }]}>
              {t("welcome_appName")}
            </Text>
            <Text style={[styles.tagline, { color: colors.white }]}>
              {t("welcome_tagline")}
            </Text>
          </View>

          <View style={styles.features}>
            <FeatureItem
              icon={<Car size={24} color={colors.primary} />}
              title={t("welcome_drive_title")}
              description={t("welcome_drive_desc")}
              bgColor={colors.darkGray}
              textColor={colors.text}
              descColor={colors.textSecondary}
            />
            <FeatureItem
              icon={<Shield size={24} color={colors.primary} />}
              title={t("welcome_safe_title")}
              description={t("welcome_safe_desc")}
              bgColor={colors.darkGray}
              textColor={colors.text}
              descColor={colors.textSecondary}
            />
            <FeatureItem
              icon={<Clock size={24} color={colors.primary} />}
              title={t("welcome_payment_title")}
              description={t("welcome_payment_desc")}
              bgColor={colors.darkGray}
              textColor={colors.text}
              descColor={colors.textSecondary}
            />
          </View>

          <View style={styles.buttons}>
            <Button
              colors={colors}
              title={t("common_login")}
              variant="primary"
              size="large"
              style={styles.button}
              onPress={() => router.push("/auth/login")}
            />
            <Button
              colors={colors}
              title={t("common_signUp")}
              variant="outline"
              size="large"
              style={styles.button}
              onPress={() => router.push("/auth/signup")}
            />
            {/* <Button
              colors={colors}
              title={t("common_sitemap")}
              variant="outline"
              size="large"
              style={styles.button}
              onPress={() => router.push("/_sitemap")}
            /> */}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function FeatureItem({
  icon,
  title,
  description,
  bgColor,
  textColor,
  descColor,
}: {
  icon: any;
  title: any;
  description: any;
  bgColor: any;
  textColor: any;
  descColor: any;
}) {
  return (
    <View style={styles.featureItem}>
      <View style={[styles.featureIcon, { backgroundColor: bgColor }]}>
        {icon}
      </View>
      <View style={styles.featureText}>
        <Text style={[styles.featureTitle, { color: textColor }]}>{title}</Text>
        <Text style={[styles.featureDescription, { color: descColor }]}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "60%",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Layout.spacing.l,
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: Layout.spacing.xl,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: Layout.spacing.m,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: Layout.spacing.xs,
  },
  tagline: {
    fontSize: 16,
    opacity: 0.8,
  },
  features: {
    marginVertical: Layout.spacing.xl,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Layout.spacing.xl,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    padding: Layout.spacing.l,
    marginRight: Layout.spacing.l,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
  },
  buttons: {
    marginBottom: Platform.OS === "ios" ? Layout.spacing.l : Layout.spacing.xl,
  },
  button: {
    marginBottom: Layout.spacing.m,
  },
});
