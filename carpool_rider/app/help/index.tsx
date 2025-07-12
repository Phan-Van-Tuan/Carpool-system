import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useThemeStore } from "@/store/themeStore";
import { Text, Card } from "@/components/ui";
import { HelpItem } from "@/components/help/HelpItem";
import {
  HelpCircle,
  MessageCircle,
  AlertTriangle,
  FileText,
  Info,
  ChevronRight,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getColors } from "@/constants/color";
import { useTranslation } from "@/constants/i18n";
import layout from "@/constants/layout";

export default function HelpScreen() {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { t } = useTranslation();
  const router = useRouter();

  const faqItems = [
    {
      id: "1",
      question: t("help.howDoIBookARide"),
      answer: t("help.bookingInstructions"),
    },
    {
      id: "2",
      question: t("help.howDoIPayForMyRide"),
      answer: t("help.paymentInstructions"),
    },
    {
      id: "3",
      question: t("help.canICancelMyBooking"),
      answer: t("help.cancellationPolicy"),
    },
    {
      id: "4",
      question: t("help.howDoIBecomeADriver"),
      answer: t("help.driverRequirements"),
    },
    {
      id: "5",
      question: t("help.isMyPersonalInfoSecure"),
      answer: t("help.securityInfo"),
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.theme.background }]}
      edges={["bottom"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card variant="flat" style={styles.contactCard}>
          <TouchableOpacity
            style={styles.contactOption}
            onPress={() => router.push("/help")}
          >
            <View style={styles.contactIconContainer}>
              <MessageCircle size={24} color={colors.primary} />
            </View>
            <View style={styles.contactTextContainer}>
              <Text variant="body" color={colors.theme.text} weight="600">
                {t("help.contactSupport")}
              </Text>
              <Text variant="bodySmall" color={colors.theme.textSecondary}>
                {t("help.contactSupportDescription")}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactOption}
            onPress={() => router.push("/help")}
          >
            <View style={styles.contactIconContainer}>
              <AlertTriangle size={24} color={colors.theme.warning} />
            </View>
            <View style={styles.contactTextContainer}>
              <Text variant="body" color={colors.theme.text} weight="600">
                {t("help.reportIssue")}
              </Text>
              <Text variant="bodySmall" color={colors.theme.textSecondary}>
                {t("help.reportIssueDescription")}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.theme.textSecondary} />
          </TouchableOpacity>
        </Card>

        <Text variant="h3" color={colors.theme.text} style={styles.faqTitle}>
          {t("help.frequentlyAskedQuestions")}
        </Text>

        {faqItems.map((item) => (
          <HelpItem
            key={item.id}
            question={item.question}
            answer={item.answer}
          />
        ))}

        <Card variant="flat" style={styles.aboutCard}>
          <Text
            variant="h3"
            color={colors.theme.text}
            style={styles.sectionTitle}
          >
            {t("help.about")}
          </Text>

          <TouchableOpacity style={styles.aboutOption}>
            <FileText size={20} color={colors.theme.textSecondary} />
            <Text
              variant="body"
              color={colors.theme.text}
              style={styles.aboutText}
            >
              {t("help.termsOfService")}
            </Text>
            <ChevronRight size={20} color={colors.theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.aboutOption}>
            <FileText size={20} color={colors.theme.textSecondary} />
            <Text
              variant="body"
              color={colors.theme.text}
              style={styles.aboutText}
            >
              {t("help.privacyPolicy")}
            </Text>
            <ChevronRight size={20} color={colors.theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.aboutOption}>
            <Info size={20} color={colors.theme.textSecondary} />
            <Text
              variant="body"
              color={colors.theme.text}
              style={styles.aboutText}
            >
              {t("profile.about")}
            </Text>
            <Text variant="body" color={colors.theme.textSecondary}>
              ver 1.0.0
            </Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.spacing.m,
  },
  contactCard: {
    marginBottom: layout.spacing.l,
  },
  sectionTitle: {
    marginBottom: layout.spacing.m,
  },
  contactOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: layout.spacing.m,
  },
  contactTextContainer: {
    flex: 1,
  },
  faqTitle: {
    marginBottom: layout.spacing.m,
  },
  aboutCard: {
    marginTop: layout.spacing.l,
  },
  aboutOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  aboutText: {
    flex: 1,
    marginLeft: layout.spacing.m,
  },
});
