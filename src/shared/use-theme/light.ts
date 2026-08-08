import { Platform, StatusBar } from "react-native";
import { HARVEST_COLORS } from "../harvest-theme";
import { THEME as commonTheme } from "./theme";
import { ITheme, ThemeColors, ThemeGradients, ThemeSizes, ThemeSpacing, } from "./types/theme";

export const COLORS: ThemeColors = {
    // Neutral colors
    white: HARVEST_COLORS.paper,
    black: HARVEST_COLORS.ink,
    background: HARVEST_COLORS.canvas,
    grey100: HARVEST_COLORS.warmPanel,
    grey200: HARVEST_COLORS.softCream,
    grey300: HARVEST_COLORS.mist,
    grey400: HARVEST_COLORS.graphite,
    grey500: HARVEST_COLORS.driftwood,
    grey600: HARVEST_COLORS.ash,
    grey700: HARVEST_COLORS.stone,
    grey800: HARVEST_COLORS.ironwood,
    grey900: HARVEST_COLORS.ink,
    
    // Primary colors (обновлено согласно cleanHouseWeb)
    primary100: HARVEST_COLORS.warningSoft,
    primary200: HARVEST_COLORS.marigoldGlow,
    primary300: '#ffc28f',
    primary400: '#ff8a45',
    primary500: HARVEST_COLORS.flame,
    primary500_12: 'rgba(250, 93, 0, 0.12)',
    primary600: HARVEST_COLORS.flamePressed,
    primary700: HARVEST_COLORS.flamePressed,
    primary800: '#b94400',
    primary900: '#873200',
    
    // Accent colors (обновлено согласно веб-версии)
    accent500: HARVEST_COLORS.flame,
    accent500_12: 'rgba(250, 93, 0, 0.12)',
    
    // Additional colors for the theme
    orange: HARVEST_COLORS.flame,
    orangeLight: HARVEST_COLORS.marigoldGlow,
    orangeDark: HARVEST_COLORS.flamePressed,
    
    // Palette colors (обновлено согласно веб-версии)
    red: HARVEST_COLORS.danger,
    blue: HARVEST_COLORS.stone,
    green: HARVEST_COLORS.success,
    
    // Дополнительные цвета из веб-версии
    destructive: HARVEST_COLORS.danger,
    destructiveLight: HARVEST_COLORS.dangerSoft,
    muted: HARVEST_COLORS.stone,

    // Семантические токены текста/поверхностей (main/* экраны)
    textPrimary: HARVEST_COLORS.ink,
    textSecondary: HARVEST_COLORS.stone,
    textPlaceholder: HARVEST_COLORS.driftwood,
    surfaceInfo: HARVEST_COLORS.softCream,
    border: HARVEST_COLORS.mist,
    ring: 'rgba(250, 93, 0, 0.35)',
    error: HARVEST_COLORS.danger,
    primary: HARVEST_COLORS.flame,
};

export const GRADIENTS: ThemeGradients = {
};

export const SIZES: ThemeSizes = {
    // global sizes
    base: 8,
    padding20: 20,
    padding10: 10,
    padding5: 5,

    // fonts sizes from Figma design tokens
    h1: 24, // Heading 1
    h2: 20, // Heading 2
    text1: 18, // Heading 3
    text2: 16, // Body M
    text3: 14, // Body S
    button: 16, // Button

    // button sizes
    buttonBorder: 1,
    buttonRadius: 16,

    // button shadow
    shadowOffsetWidth: 0,
    shadowOffsetHeight: 7,
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,

    // input sizes
    inputHeight: 46,
    inputBorder: 1,
    inputRadius: 16,
    inputPadding: 12,
    
    // TopBar sizes 
    topBarPaddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 50,
    topBarContentPaddingVertical: Platform.OS === 'android' ? 8 : 26,
    topBarContentPaddingVerticalWithBadge: Platform.OS === 'android' ? 6 : 16,
};

export const SPACING: ThemeSpacing = {
    /** xs: 4px */
    xs: SIZES.base * 0.5,
    /** s: 8px */
    s: SIZES.base * 1,
    /** sm: 16px */
    sm: SIZES.base * 2,
    /** m: 24px */
    m: SIZES.base * 3,
    /** md: 32px */
    md: SIZES.base * 4,
    /** l: 40px */
    l: SIZES.base * 5,
    /** xl: 48px */
    xl: SIZES.base * 6,
    /** xxl: 56px */
    xxl: SIZES.base * 7,
};

export const LIGHT: ITheme = {
    ...commonTheme,
    colors: COLORS,
    gradients: GRADIENTS,
    sizes: {...SIZES, ...commonTheme.sizes, ...SPACING},
};
