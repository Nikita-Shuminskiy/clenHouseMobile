import * as React from "react";
import { ColorValue, FlexStyle, ImageSourcePropType, ScaledSize, TextStyle, } from "react-native";

// Spacing types
export interface ISpacing
    extends Pick<
        FlexStyle,
        | "margin"
        | "marginVertical"
        | "marginHorizontal"
        | "marginLeft"
        | "marginRight"
        | "marginTop"
        | "marginBottom"
        | "padding"
        | "paddingVertical"
        | "paddingHorizontal"
        | "paddingLeft"
        | "paddingRight"
        | "paddingTop"
        | "paddingBottom"
    > {
}

export interface ITheme {
    colors: ThemeColors;
    gradients: ThemeGradients;
    sizes: ThemeSizes & ThemeSpacing & ICommonTheme["sizes"];
    assets: ThemeAssets;
    fonts: ThemeFonts;
    weights: ThemeWeights;
    lines: ThemeLineHeights;
}

export interface ICommonTheme {
    assets: ThemeAssets;
    fonts: ThemeFonts;
    weights: ThemeWeights;
    lines: ThemeLineHeights;
    sizes: {
        width: ScaledSize["width"];
        height: ScaledSize["height"];
    };
}

export interface IThemeProvider {
    children?: React.ReactNode;
    theme?: ITheme;
    setTheme?: (theme?: ITheme) => void;
}

export interface ThemeColors {
    // Neutral colors
    white: ColorValue;
    black: ColorValue;
    background: ColorValue;
    grey100: ColorValue;
    grey200: ColorValue;
    grey300: ColorValue;
    grey400: ColorValue;
    grey500: ColorValue;
    grey600: ColorValue;
    grey700: ColorValue;
    grey800: ColorValue;
    grey900: ColorValue;
    
    // Primary colors
    primary100: ColorValue;
    primary200: ColorValue;
    primary300: ColorValue;
    primary400: ColorValue;
    primary500: ColorValue;
    primary500_12: ColorValue;
    primary600: ColorValue;
    primary700: ColorValue;
    primary800: ColorValue;
    primary900: ColorValue;
    
    // Accent colors
    accent500: ColorValue;
    accent500_12: ColorValue;
    
    // Additional colors for the theme
    orange: ColorValue;
    orangeLight: ColorValue;
    orangeDark: ColorValue;
    
    // Palette colors
    red: ColorValue;
    blue: ColorValue;
    green: ColorValue;
    
    // Дополнительные цвета из веб-версии
    destructive: ColorValue; // Для ошибок и предупреждений
    muted: ColorValue; // Приглушенный текст
    border: ColorValue; // Границы
    ring: ColorValue; // Фокус кольца
}

export interface ThemeGradients {
    primary?: string[];
    secondary?: string[];
    tertiary?: string[];
    black?: string[];
    white?: string[];
    light?: string[];
    dark?: string[];
    gray?: string[];
    danger?: string[];
    warning?: string[];
    success?: string[];
    info?: string[];
    divider?: string[];
    menu?: string[];
}

export interface ThemeSizes {
    padding20: number;
    padding10: number;
    base: number;
    padding5: number;
    h1: number;
    h2: number,
    text1: number,
    text2: number,
    text3: number,
    button: number,
    buttonBorder: number;
    buttonRadius: number;
    inputHeight: number;
    inputBorder: number;
    inputRadius: number;
    inputPadding: number;
    shadowOffsetWidth: number;
    shadowOffsetHeight: number;
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
    topBarPaddingTop: number;
    topBarContentPaddingVertical: number;
    topBarContentPaddingVerticalWithBadge: number;
}

export interface ThemeSpacing {
    xs: number;
    s: number;
    sm: number;
    m: number;
    md: number;
    l: number;
    xl: number;
    xxl: number;
}

export interface ThemeWeights {

    h1: TextStyle["fontWeight"],
    h2: TextStyle["fontWeight"]
    text1: TextStyle["fontWeight"]
    text2: TextStyle["fontWeight"]
    text3: TextStyle["fontWeight"]
    button: TextStyle["fontWeight"]

    thin: TextStyle["fontWeight"];
    extralight: TextStyle["fontWeight"];
    light: TextStyle["fontWeight"];
    normal: TextStyle["fontWeight"];
    medium: TextStyle["fontWeight"];
    semibold?: TextStyle["fontWeight"];
    bold?: TextStyle["fontWeight"];
    extrabold?: TextStyle["fontWeight"];
    black?: TextStyle["fontWeight"];
}

export interface ThemeAssets {
    OnestRegular: any
    OnestMedium: any
    OnestBold: any
    OnestVariable: any

    logo: ImageSourcePropType;
    /*
      header: ImageSourcePropType;
      background: ImageSourcePropType;

      ios: ImageSourcePropType;
      android: ImageSourcePropType;*/
}

export interface ThemeFonts {
    h1: string;
    h2: string,
    text1: string,
    text2: string,
    text3: string,
    button: string,
}

export interface ThemeLineHeights {
    h1: number;
    h2: number,
    text1: number,
    text2: number,
    text3: number,
    button: number,
}
