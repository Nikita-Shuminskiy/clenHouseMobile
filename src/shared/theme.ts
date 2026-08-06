import { useTheme as useCurrentTheme } from "./use-theme";

export const Neutral = {
  white: "#FFFFFF",
  black: "#000000",
  grey: "#667069",
  background: "#F6F7F4",
};

export const Primary = {
  primary: "#FF5E00",
  orange: "#FF5E00",
  green: "#1F7A4D",
};

export const Accent = {
  red: "#DC2626",
  blue: "#2196F3",
  orange: "#FF8000",
};

export const Palette = {
  red: "#DC2626",
  orange: "#FF5E00",
  green: "#1F7A4D",
};

export const Typography = {
  bodyRegular: {
    fontFamily: "Onest",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  bodyMedium: {
    fontFamily: "Onest",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600" as const,
  },
};

export const useTheme = useCurrentTheme;
