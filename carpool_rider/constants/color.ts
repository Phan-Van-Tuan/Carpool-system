import { ThemeType } from "@/types";

const colors = {
  primary: "#2ecc71",
  primaryDark: "#27ae60",
  primaryLight: "#a5f3c4",

  // Light theme
  light: {
    background: "#ffffff",
    card: "#f9f9f9",
    text: "#333333",
    textSecondary: "#666666",
    border: "#e0e0e0",
    notification: "#ff3b30",
    success: "#34c759",
    warning: "#ffcc00",
    error: "#ff3b30",
    info: "#5ac8fa",
    disabled: "#c7c7cc",
    placeholder: "#c7c7cc",
    backdrop: "rgba(0, 0, 0, 0.5)",
  },

  // Dark theme
  dark: {
    background: "#121212",
    card: "#1e1e1e",
    text: "#ffffff",
    textSecondary: "#b0b0b0",
    border: "#2c2c2c",
    notification: "#ff453a",
    success: "#30d158",
    warning: "#ffd60a",
    error: "#ff453a",
    info: "#64d2ff",
    disabled: "#3a3a3c",
    placeholder: "#3a3a3c",
    backdrop: "rgba(0, 0, 0, 0.7)",
  },
};

export const getColors = (theme: ThemeType) => {
  return {
    ...colors,
    theme: colors[theme],
  };
};

export default colors;
