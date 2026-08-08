import { useTheme as useCurrentTheme } from "./use-theme";
import { HARVEST_COLORS } from "./harvest-theme";

export const Neutral = {
  white: HARVEST_COLORS.paper,
  black: HARVEST_COLORS.ink,
  grey: HARVEST_COLORS.stone,
  background: HARVEST_COLORS.canvas,
};

export const Primary = {
  primary: HARVEST_COLORS.flame,
  orange: HARVEST_COLORS.flame,
  green: HARVEST_COLORS.success,
};

export const Accent = {
  red: HARVEST_COLORS.danger,
  blue: HARVEST_COLORS.stone,
  orange: HARVEST_COLORS.flame,
};

export const Palette = {
  red: HARVEST_COLORS.danger,
  orange: HARVEST_COLORS.flame,
  green: HARVEST_COLORS.success,
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
