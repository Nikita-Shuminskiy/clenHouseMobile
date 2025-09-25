import { Dimensions, Platform } from "react-native";

import {
  ICommonTheme,
  ThemeFonts,
  ThemeLineHeights,
  ThemeWeights,
} from "./types/theme";

const { width, height } = Dimensions.get("window");

// Naming source: https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#Common_weight_name_mapping
export const WEIGHTS: ThemeWeights = {
  // based on fontWeight from Figma design tokens

  h1: Platform.OS === "ios" ? "600" : 600, // SemiBold
  h2: Platform.OS === "ios" ? "500" : 500, // Medium
  text1: Platform.OS === "ios" ? "500" : 500, // Medium
  text2: Platform.OS === "ios" ? "400" : 400, // Regular
  text3: Platform.OS === "ios" ? "400" : 400, // Regular
  button: Platform.OS === "ios" ? "600" : 800, // SemiBold

  thin: Platform.OS === "ios" ? "100" : 100,
  extralight: Platform.OS === "ios" ? "200" : 200,
  light: Platform.OS === "ios" ? "300" : 300,
  normal: Platform.OS === "ios" ? "400" : 400,
  medium: Platform.OS === "ios" ? "500" : 500,
  semibold: Platform.OS === "ios" ? "600" : 800,
  bold: Platform.OS === "ios" ? "700" : 700,
  extrabold: Platform.OS === "ios" ? "800" : 800,
  black: Platform.OS === "ios" ? "900" : 900,
};

export const ASSETS: any = {
  OnestRegular: require("../../../assets/fonts/Onest-Regular.ttf"),
  OnestMedium: require("../../../assets/fonts/Onest-Medium.ttf"),
  OnestBold: require("../../../assets/fonts/Onest-Bold.ttf"),
};

export const FONTS: ThemeFonts = {
  h1: "OnestBold", // Heading 1: SemiBold (24px/32px)
  h2: "OnestMedium", // Heading 2: Medium (20px/28px)
  text1: "OnestMedium", // Heading 3: Medium (18px/24px)
  text2: "OnestRegular", // Body M Regular: Regular (16px/24px)
  text3: "OnestMedium", // Body M Medium: Medium (16px/24px)
  button: "OnestBold", // Button: SemiBold (16px/24px)
};

export const LINE_HEIGHTS: ThemeLineHeights = {
  h1: 32, // Heading 1: 24px/32px
  h2: 28, // Heading 2: 20px/28px
  text1: 24, // Heading 3: 18px/24px
  text2: 24, // Body M: 16px/24px
  text3: 20, // Body S: 14px/20px
  button: 24, // Button: 16px/24px
};

export const THEME: ICommonTheme = {
  assets: { ...ASSETS },
  fonts: FONTS,
  weights: WEIGHTS,
  lines: LINE_HEIGHTS,
  sizes: { width, height },
};
