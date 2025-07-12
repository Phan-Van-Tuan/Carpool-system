import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/color";
import { Text, Card, Button } from "@/components/ui";
import { Language } from "@/types";
import { Globe, Check } from "lucide-react-native";
import layout from "@/constants/layout";
import { getLanguageName, useTranslation } from "@/constants/i18n";

interface LanguageSelectorProps {
  currentLanguage: Language;
  onSelectLanguage: (language: Language) => void;
}

export function LanguageSelector({
  currentLanguage,
  onSelectLanguage,
}: LanguageSelectorProps) {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const languages: Language[] = ["en", "vi", "zh"];

  const handleLanguageSelect = (language: Language) => {
    onSelectLanguage(language);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.languageSelector,
          {
            borderColor: colors.theme.border,
            backgroundColor: `${colors.theme.border}40`,
          },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.languageLeft}>
          <View
            style={[
              styles.menuIcon,
              { backgroundColor: `${colors.primary}20` },
            ]}
          >
            <Globe size={20} color={colors.primary} />
          </View>

          <Text
            variant="body"
            color={colors.theme.text}
            style={styles.languageText}
          >
            {t("profile.language")}
          </Text>
        </View>
        <Text variant="body" color={colors.theme.textSecondary}>
          {getLanguageName(currentLanguage)}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Card
            variant="elevated"
            style={[
              styles.modalContent,
              { backgroundColor: colors.theme.background },
            ]}
          >
            <Text
              variant="h3"
              color={colors.theme.text}
              style={styles.modalTitle}
            >
              {t("profile.selectLanguage")}
            </Text>

            {languages.map((language) => (
              <TouchableOpacity
                key={language}
                style={styles.languageOption}
                onPress={() => handleLanguageSelect(language)}
              >
                <Text variant="body" color={colors.theme.text}>
                  {getLanguageName(language)}
                </Text>
                {currentLanguage === language && (
                  <Check size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}

            <Button
              title={t("common.cancel")}
              onPress={() => setModalVisible(false)}
              variant="outline"
              style={styles.cancelButton}
            />
          </Card>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  languageSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    // marginRight: layout.spacing.m,
  },
  languageLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageText: {
    marginLeft: layout.spacing.m,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: layout.spacing.m,
  },
  modalContent: {
    width: "90%",
    maxWidth: 400,
    padding: layout.spacing.l,
    borderRadius: layout.borderRadius.large,
  },
  modalTitle: {
    marginBottom: layout.spacing.l,
    textAlign: "center",
  },
  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  cancelButton: {
    marginTop: layout.spacing.l,
  },
});
