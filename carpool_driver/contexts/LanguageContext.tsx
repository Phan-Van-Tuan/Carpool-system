import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import en from "@/constants/locales/en";
import vi from "@/constants/locales/vi";
import zh from "@/constants/locales/zh";

export type LanguageCode = "en" | "vi" | "zh";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, options?: Record<string, any>) => string;
  availableLanguages: { code: LanguageCode; name: string }[];
}

const translations = {
  en,
  vi,
  zh,
};

const availableLanguages = [
  { code: "en" as LanguageCode, name: "English" },
  { code: "vi" as LanguageCode, name: "Tiếng Việt" },
  { code: "zh" as LanguageCode, name: "中文" },
];

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    // Load saved language preference or use device locale
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("language-preference");
        if (
          savedLanguage &&
          (savedLanguage === "en" ||
            savedLanguage === "vi" ||
            savedLanguage === "zh")
        ) {
          setLanguageState(savedLanguage as LanguageCode);
        } else {
          // Use device locale or default to English
          const deviceLocale = Localization.locale.split("-")[0];
          if (deviceLocale === "vi" || deviceLocale === "zh") {
            setLanguageState(deviceLocale as LanguageCode);
          }
        }
      } catch (error) {
        console.error("Failed to load language preference:", error);
      }
    };

    loadLanguage();
  }, []);

  // Translation function
  const t = (key: string, options?: Record<string, any>) => {
    const translation: any = translations[language];
    if (!translation) return key;

    let text = translation[key] || key;

    // Replace variables in the text
    if (options) {
      Object.keys(options).forEach((option) => {
        text = text.replace(new RegExp(`{{${option}}}`, "g"), options[option]);
      });
    }

    return text;
  };

  // Set language and save to storage
  const setLanguage = async (newLanguage: LanguageCode) => {
    setLanguageState(newLanguage);
    try {
      await AsyncStorage.setItem("language-preference", newLanguage);
    } catch (error) {
      console.error("Failed to save language preference:", error);
    }
  };

  const value = {
    language,
    setLanguage,
    t,
    availableLanguages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
