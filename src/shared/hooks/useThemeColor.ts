/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from 'react-native';

import { Neutral, Primary, Accent } from '../theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Neutral | keyof typeof Primary | keyof typeof Accent
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  // Возвращаем цвет по умолчанию
  if (colorName in Neutral) {
    return Neutral[colorName as keyof typeof Neutral];
  }
  if (colorName in Primary) {
    return Primary[colorName as keyof typeof Primary];
  }
  if (colorName in Accent) {
    return Accent[colorName as keyof typeof Accent];
  }

  return Neutral.black;
}
