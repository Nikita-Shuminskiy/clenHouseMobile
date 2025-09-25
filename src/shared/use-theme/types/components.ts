import { LinearGradientPoint } from "expo-linear-gradient";
import * as React from "react";
import {
  ColorValue,
  ImageProps,
  ImageStyle,
  KeyboardAvoidingViewProps,
  ScrollViewProps,
  StyleProp,
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewProps,
  ViewStyle,
} from "react-native";

import { ISpacing, ITheme } from "./theme";

export type LinkProps = {
  onPress: () => void;
  text?: string;
  img?: string;
  styleLink?: StyleProp<ViewStyle>;
  styleText?: TextStyle;
  styleImg?: StyleProp<ImageStyle>;
  colorText?: TextStyle["color"];
  transparencyPrimary?: boolean;
  beige?: boolean;
  beigeLight?: boolean;
  transparency80?: boolean;
  primary?: boolean;
  green?: boolean;
  greenLight?: boolean;
  yellow?: boolean;
  pink?: boolean;
  turquase?: boolean;
  turquaseLight?: boolean;
  orange?: boolean;
  orangeLight?: boolean;
  orangeDark?: boolean;
  supportGreen?: boolean;
  gray?: boolean;
  red?: boolean;
  blue?: boolean;
};

export interface IBlockProps
  extends ISpacing,
    ViewProps,
    ScrollViewProps,
    KeyboardAvoidingViewProps {
  animation?: Animation;
  delay?: number;
  duration?: number;
  iterationCount?: number | 'infinite'
  transparent?: boolean;
  gap?: number;

  button?: boolean;
  h1?: boolean;
  text1?: boolean;
  h2?: boolean;
  text2?: boolean;



  transparencyPrimary?: boolean;
  beige?: boolean;
  beigeLight?: boolean;
  primary?: boolean;
  green?: boolean;
  greenLight?: boolean;
  yellow?: boolean;
  pink?: boolean;
  turquase?: boolean;
  turquaseLight?: boolean;
  orange?: boolean;
  orangeLight?: boolean;
  orangeDark?: boolean;
  supportGreen?: boolean;
  gray?: boolean;
  red?: boolean;
  blue?: boolean;
  /**
   * id for testID & accesibilityLabel
   */
  id?: string;
  /**
   * Renders a View flex style
   * @see https://reactnative.dev/docs/flexbox#proptypes
   * @see https://reactnative.dev/docs/layout-props
   */
  flex?: ViewStyle["flex"];
  /**
   * Renders a View flexDirection: row style
   * @see https://reactnative.dev/docs/flexbox#flex-direction
   */
  row?: boolean;
  /**
   * Renders a View flexWrap style
   * @see https://reactnative.dev/docs/flexbox#flex-wrap
   */
  wrap?: ViewStyle["flexWrap"];
  /**
   * Renders a SafeAreaView component
   * @see https://reactnative.dev/docs/safeareaview
   */
  safe?: boolean;
  /**
   * Renders a KeyboardAwareScrollView component
   * @see https://github.com/APSL/react-native-keyboard-aware-scroll-view#usage
   */
  keyboard?: boolean;
  /**
   * Renders a ScrollView component
   * @see https://reactnative.dev/docs/scrollview
   */
  scroll?: boolean;
  /**
   * Generates a shadow style
   * @see https://reactnative.dev/docs/shadow-props
   */
  shadow?: boolean;
  /**
   * Renders a View with predefined justifyContent: center
   * @see https://reactnative.dev/docs/flexbox#justify-content
   */
  center?: boolean;
  /**
   * Renders a View with predefined borderWidth: 1, backgroundColor: 'transparent' & borderColor inherited
   */
  outlined?: boolean;
  /**
   * Renders the View/Block component with custom style, overwrite existing/predefined styles
   * @see https://reactnative.dev/docs/view#style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Renders a View style overflow
   * @see https://reactnative.dev/docs/layout-props#overflow
   */
  overflow?: ViewStyle["overflow"];
  /**
   * Renders a custom backgroundColor
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  color?: ViewStyle["backgroundColor"];
  /**
   * Renders LinearGradient component, colors
   * @see https://docs.expo.io/versions/latest/sdk/linear-gradient/#props
   */
  gradient?: string[];

  radius?: ViewStyle["borderRadius"];
  /**
   * Renders a custom height value
   * @see https://reactnative.dev/docs/layout-props#height
   */
  height?: ViewStyle["height"];
  /**
   * Renders a custom width value
   * @see https://reactnative.dev/docs/layout-props#width
   */
  width?: ViewStyle["width"];
  /**
   * Renders a flex justifyContent
   * Available values: 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'
   * @see https://reactnative.dev/docs/layout-props#justifycontent
   */
  justify?: ViewStyle["justifyContent"];
  /**
   * Renders a flex alignItems
   * Available values: 'auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline'
   * @see https://reactnative.dev/docs/layout-props#alignitems
   */
  align?: ViewStyle["alignItems"];
  /**
   * Renders the View content
   */
  children?: React.ReactNode;
  /**
   * Renders a BlueView component
   * @see https://docs.expo.io/versions/latest/sdk/blur-view/
   */
  blur?: boolean;
  /**
   * BlueView intensity, default: 50, values accepted: 1 to 100
   * @see https://docs.expo.io/versions/latest/sdk/blur-view/#intensity
   */
  /*  intensity?: BlurViewProps['intensity'];
  /!**
   * BlueView tint color, default: 'default', values accepted: 'light', 'dark', 'default'
   * @see https://docs.expo.io/versions/latest/sdk/blur-view/#blurtint
   *!/
  tint?: BlurViewProps['tint'];*/
  /**
   * Renders the View position
   * @see https://reactnative.dev/docs/layout-props#position
   */
  position?: ViewStyle["position"];
  /**
   * Renders the View right offset
   * @see https://reactnative.dev/docs/layout-props#right
   */
  right?: ViewStyle["right"];
  /**
   * Renders the View left offset
   * @see https://reactnative.dev/docs/layout-props#left
   */
  left?: ViewStyle["left"];
  /**
   * Renders the View top offset
   * @see https://reactnative.dev/docs/layout-props#top
   */
  top?: ViewStyle["top"];
  /**
   * Renders the View bottom offset
   * @see https://reactnative.dev/docs/layout-props#bottom
   */
  bottom?: ViewStyle["bottom"];
  /**
   * Renders LinearGradient start points
   * @see https://docs.expo.io/versions/latest/sdk/linear-gradient/#props
   */
  start?: LinearGradientPoint;
  /**
   * Renders LinearGradient end points
   * @see https://docs.expo.io/versions/latest/sdk/linear-gradient/#props
   */
  end?: LinearGradientPoint;
}

export interface ITextProps {
  id?: string;
  animation?: string;
  duration?: number;
  iterationCount?: number | 'infinite'
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
  center?: boolean;
  gradient?: boolean;
  color?: string;
  opacity?: number;
  size?: number;
  weight?: string;
  font?: string;
  align?: "auto" | "left" | "right" | "center" | "justify";
  transform?: "none" | "capitalize" | "uppercase" | "lowercase";
  lineHeight?: number;
  position?: "absolute" | "relative";
  right?: number;
  left?: number;
  top?: number;
  bottom?: number;
  start?: number;
  end?: number;
  marginBottom?: number;
  marginTop?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  marginRight?: number;
  marginLeft?: number;
  paddingBottom?: number;
  paddingTop?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  paddingRight?: number;
  paddingLeft?: number;


  button?: boolean;
  h1?: boolean;
  text1?: boolean;
  h2?: boolean;
  text2?: boolean;
  text3?: boolean;

  white?: boolean;
  beige?: boolean;
  redOrange?: boolean;
  black?: boolean;
  orange?: boolean;
  darkGrey?: boolean;
  beigeLight?: boolean;
  red?: boolean;
  gray?: boolean;
  turquase?: boolean;
  green?: boolean;
}

export interface IImageProps extends ImageProps, ISpacing {
  animation?: Animation;
  duration?: number;
  iterationCount?: number;
  source?: any;
  width?: any;

  /**
   * id for testID & accesibilityLabel
   */
  id?: string;
  /**
   * Avatar sizing: borderRadius from Math.min(height, weight)
   * sets the width & height to Math.min(height, weight)
   */
  avatar?: boolean;
  /**
   * Generates a shadow style
   * @see https://reactnative.dev/docs/shadow-props
   */
  shadow?: boolean;
  /**
   * Renders an ImageBackground component
   * @see https://reactnative.dev/docs/imagebackground
   */
  background?: boolean;
  /**
   * Renders a predefined theme sizes.borderRadius & overflow: 'hidden'
   * @see https://reactnative.dev/docs/image-style-props#borderradius
   */
  rounded?: boolean;
  /**
   * Renders a custom borderRadius value
   * @see https://reactnative.dev/docs/image-style-props#borderradius
   */
  radius?: ImageStyle["borderRadius"];
  /**
   * Changes the color of all the non-transparent pixels to the tintColor.
   * @see https://reactnative.dev/docs/image-style-props#tintcolor
   */
  color?: ImageStyle["tintColor"];
  /**
   * Modify the appearance and position of your ui using 2D or 3D transformations
   * @see https://reactnative.dev/docs/transforms#transform
   */
  transform?: ImageStyle["transform"];
  /**
   * Renders the Image component with custom style, overwrite existing/predefined styles
   * @see https://reactnative.dev/docs/image#style
   */
  style?: StyleProp<ImageStyle>;
  /** Renders the ImageBackground content */
  children?: React.ReactNode;
}

export interface IButtonProps extends TouchableOpacityProps, ISpacing {
  /**
   * id for testID & accesibilityLabel
   */
  id?: string;

  /**
   * Renders borderRadius value to maxSize / 2 using
   * maxSize value is calculated from the maximum value from width, minWidth, maxWidth, height, minHeight, maxHeight
   * @see https://reactnative.dev/docs/view-style-props#borderradius
   */
  round?: boolean;

  /**
   * Renders borderRadius value using theme sizes.s; default sizes.buttonRadius
   * @see https://reactnative.dev/docs/view-style-props#borderradius
   */
  rounded?: boolean;
  /**
   * Renders a View flex style
   * @see https://reactnative.dev/docs/flexbox#proptypes
   * @see https://reactnative.dev/docs/layout-props
   */
  flex?: ViewStyle["flex"];
  /**
   * Renders a custom borderRadius value
   * @see https://reactnative.dev/docs/view-style-props#borderradius
   */
  radius?: ViewStyle["borderRadius"];
  /**
   * Renders a custom backgroundColor value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  color?: string;
  /**
   * Renders LinearGradient component, colors
   * @see https://docs.expo.io/versions/latest/sdk/linear-gradient/#props
   */
  gradient?: string[];
  /**
   * Renders a backgroundColor directly from the colors.primary value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  primary?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.secondary value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  secondary?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.tertiary value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  tertiary?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.gray value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  gray?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.black value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  black?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.white value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  white?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.light value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  light?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.dark value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  dark?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.danger value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  danger?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.warning value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  warning?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.success value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  success?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.info value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  info?: boolean;
  /**
   * Renders a View flexDirection: row style
   * @see https://reactnative.dev/docs/flexbox#flex-direction
   */
  row?: boolean;
  /**
   * Renders a flex alignItems
   * Available values: 'auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline'
   * @see https://reactnative.dev/docs/layout-props#alignitems
   */
  align?: ViewStyle["alignItems"];
  /**
   * Renders a flex justifyContent
   * Available values: 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'
   * @see https://reactnative.dev/docs/layout-props#justifycontent
   */
  justify?: ViewStyle["justifyContent"];
  /**
   * Renders a custom height value
   * @see https://reactnative.dev/docs/layout-props#height
   */
  height?: ViewStyle["height"];
  /**
   * Renders a custom width value
   * @see https://reactnative.dev/docs/layout-props#width
   */
  width?: ViewStyle["width"];
  /**
   * Renders the container style with predefined borderWidth: 1, backgroundColor: 'transparent' & borderColor inherited
   */
  outlined?: boolean | string;
  /**
   * Generates a shadow style
   * @see https://reactnative.dev/docs/shadow-props
   */
  shadow?: boolean;
  /**
   * Renders social icons ('logo-facebook', 'logo-twitter', 'logo-dribbble') from Ionicons
   * @see https://docs.expo.io/guides/icons/
   * @see https://icons.expo.fyi
   */
  social?: "facebook" | "twitter" | "dribbble";
  /**
   * Renders the View position
   * @see https://reactnative.dev/docs/layout-props#position
   */
  position?: ViewStyle["position"];
  /**
   * Renders the View right offset
   * @see https://reactnative.dev/docs/layout-props#right
   */
  right?: ViewStyle["right"];
  /**
   * Renders the View left offset
   * @see https://reactnative.dev/docs/layout-props#left
   */
  left?: ViewStyle["left"];
  /**
   * Renders the View top offset
   * @see https://reactnative.dev/docs/layout-props#top
   */
  top?: ViewStyle["top"];
  /**
   * Renders the View bottom offset
   * @see https://reactnative.dev/docs/layout-props#bottom
   */
  bottom?: ViewStyle["bottom"];
  /**
   * Provides haptic feedback on touch - Haptics.selectionAsync()
   * @see https://docs.expo.io/versions/latest/sdk/haptics/
   */
  haptic?: boolean;
  /**
   * Adds vibration feedback on touch using Vibration.vibrate pattern
   * @see https://reactnative.dev/docs/vibration
   */
  vibrate?: number | number[] | null;
  /**
   * Repeat vibration pattern
   * @see https://reactnative.dev/docs/vibration
   */
  vibrateRepeat?: boolean | null;
  /**
   * Renders Button content
   */
  children?: React.ReactNode;

  transparencyPrimary?: boolean;
  beige?: boolean;
  beigeLight?: boolean;
  transparency80?: boolean;
  green?: boolean;
  greenLight?: boolean;
  yellow?: boolean;
  pink?: boolean;
  turquase?: boolean;
  turquaseLight?: boolean;
  orange?: boolean;
  supportGreen?: boolean;
  red?: boolean;
}
