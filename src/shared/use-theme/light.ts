import { Platform, StatusBar } from "react-native";
import { THEME as commonTheme } from "./theme";
import { ITheme, ThemeColors, ThemeGradients, ThemeSizes, ThemeSpacing, } from "./types/theme";

export const COLORS: ThemeColors = {
    // Neutral colors
    white: '#FFFFFF',
    black: '#000000',
    background: '#F3F3F3', // Обновлено согласно веб-версии
    grey100: '#F5F5F5',
    grey200: '#E8E8E8',
    grey300: '#D1D1D1',
    grey400: '#999999', // Обновлено согласно веб-версии
    grey500: '#9E9E9E',
    grey600: '#757575',
    grey700: '#616161',
    grey800: '#424242',
    grey900: '#2C2C2C',
    
    // Primary colors (обновлено согласно cleanHouseWeb)
    primary100: '#FFE0D6',
    primary200: '#FFC4A3',
    primary300: '#FFA370',
    primary400: '#FF8A4D',
    primary500: '#FF5E00', // Основной цвет из веб-версии
    primary500_12: 'rgba(255, 94, 0, 0.12)',
    primary600: '#FF8000', // Accent цвет из веб-версии
    primary700: '#E55A2B',
    primary800: '#B23A17',
    primary900: '#992A0D',
    
    // Accent colors (обновлено согласно веб-версии)
    accent500: '#FF8000', // Accent цвет из веб-версии
    accent500_12: 'rgba(255, 128, 0, 0.12)',
    
    // Additional colors for the theme
    orange: '#FF5E00', // Обновлено согласно веб-версии
    orangeLight: '#FF8000', // Accent цвет
    orangeDark: '#E55A2B',
    
    // Palette colors (обновлено согласно веб-версии)
    red: '#DC2626', // Destructive цвет из веб-версии
    blue: '#2196F3',
    green: '#4CAF50',
    
    // Дополнительные цвета из веб-версии
    destructive: '#DC2626', // Для ошибок и предупреждений
    muted: 'rgba(0,0,0,0.7)', // Приглушенный текст
    border: 'rgba(0,0,0,0.08)', // Границы
    ring: 'rgba(255, 94, 0, 0.35)', // Фокус кольца
};

export const GRADIENTS: ThemeGradients = {
    /* primary: ["#FF0080", "#7928CA"],
     secondary: ["#A8B8D8", "#627594"],
     info: ["#21D4FD", "#2152FF"],
     success: ["#98EC2D", "#17AD37"],
     warning: ["#FBCF33", "#F53939"],
     danger: ["#FF667C", "#EA0606"],

     light: ["#EBEFF4", "#CED4DA"],
     dark: ["#3A416F", "#141727"],

   /!*  white: [String(COLORS.white), "#EBEFF4"],
     black: [String(COLORS.black), "#141727"],*!/

     divider: ["rgba(255,255,255,0.3)", "rgba(102, 116, 142, 0.6)"],
     menu: [
       "rgba(255, 255, 255, 0.2)",
       "rgba(112, 125, 149, 0.5)",
       "rgba(255, 255, 255, 0.2)",
     ],*/
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
    buttonRadius: 8,

    // button shadow
    shadowOffsetWidth: 0,
    shadowOffsetHeight: 7,
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,

    // input sizes
    inputHeight: 46,
    inputBorder: 1,
    inputRadius: 8,
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
