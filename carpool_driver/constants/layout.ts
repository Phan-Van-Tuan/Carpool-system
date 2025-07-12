import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  spacing: {
    xs: 2,
    s: 4,
    ms: 6,
    m: 8,
    ml: 12,
    l: 16,
    xl: 24,
    xxl: 32,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    xl: 16,
    xxl: 24,
    round: 9999,
  },
};
