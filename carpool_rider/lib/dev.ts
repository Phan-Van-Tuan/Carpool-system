import { Alert } from "react-native";

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
export const showComingSoonAlert = () => {
  Alert.alert("Coming soon", "Feature available soon");
};
