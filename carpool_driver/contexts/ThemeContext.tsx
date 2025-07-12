import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define theme colors
const lightTheme = {
  primary: "#2A9D8F",
  secondary: "#F4A261",
  success: "#4CAF50",
  danger: "#F44336",
  warning: "#FFC107",
  info: "#2196F3",
  dark: "#333333",
  darkGray: "#edebeb",
  gray: "#9E9E9E",
  lightGray: "#E0E0E0",
  extraLightGray: "#F5F5F5",
  white: "#FFFFFF",
  black: "#000000",
  background: "#F8F9FA",
  card: "#FFFFFF",
  text: "#212121",
  textSecondary: "#757575",
  border: "#E0E0E0",
  notification: "#F4A261",
  shadow: "rgba(0, 0, 0, 0.1)",
  overlay: "rgba(0, 0, 0, 0.5)",
  transparent: "transparent",
};

const darkTheme = {
  primary: "#2A9D8F",
  secondary: "#F4A261",
  success: "#4CAF50",
  danger: "#F44336",
  warning: "#FFC107",
  info: "#2196F3",
  dark: "#1A1A1A",
  darkGray: "#333333",
  gray: "#757575",
  lightGray: "#BDBDBD",
  extraLightGray: "#E0E0E0",
  white: "#FFFFFF",
  black: "#000000",
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
  textSecondary: "#AAAAAA",
  border: "#333333",
  notification: "#F4A261",
  shadow: "rgba(0, 0, 0, 0.5)",
  overlay: "rgba(0, 0, 0, 0.7)",
  transparent: "transparent",
};

type ThemeType = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  colors: typeof darkTheme;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>("dark");

  useEffect(() => {
    // Load saved theme preference
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme-preference");
        if (
          savedTheme &&
          (savedTheme === "light" ||
            savedTheme === "dark" ||
            savedTheme === "system")
        ) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      }
    };

    loadTheme();
  }, []);

  // Determine if dark mode should be active
  const isDark =
    theme === "system" ? systemColorScheme === "dark" : theme === "dark";

  // Get the appropriate color scheme
  const colors = isDark ? darkTheme : lightTheme;

  // Set theme and save to storage
  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem("theme-preference", newTheme);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  const value = {
    theme,
    isDark,
    colors,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
