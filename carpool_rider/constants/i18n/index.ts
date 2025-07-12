import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language } from "@/types";
import { useLanguageStore } from "@/store/languageStore";
import en from "./en";
import vi from "./vi";
import zh from "./zh";

const translations = {
  en,
  vi,
  zh,
};

export const useTranslation = () => {
  const { language, setLanguage } = useLanguageStore();

  const t = (key: string) => {
    const keys = key.split(".");
    let translation: any = translations[language];

    for (const k of keys) {
      if (translation[k] === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      translation = translation[k];
    }

    return translation;
  };

  const changeLanguage = async (lang: Language) => {
    setLanguage(lang);
    await AsyncStorage.setItem("language", lang);
  };

  return { t, language, changeLanguage };
};

export const getLanguageName = (code: Language): string => {
  const languages = {
    en: "English",
    vi: "Tiếng Việt",
    zh: "中文",
  };

  return languages[code];
};

export default translations;
