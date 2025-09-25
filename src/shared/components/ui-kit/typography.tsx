import React from "react";
import { Platform, StyleSheet, Text, TextStyle } from "react-native";
import { Typography as TypographyStyles } from "../../theme";

interface TypographyProps {
    id?: string;
    children: React.ReactNode;
    style?: TextStyle;
    variant?: keyof typeof TypographyStyles;
    center?: boolean;
    color?: string;
    opacity?: number;
    size?: number;
    weight?: string;
    font?: string;
    align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    lineHeight?: number;
    position?: 'relative' | 'absolute';
    right?: number;
    left?: number;
    top?: number;
    bottom?: number;
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
}

const Typography = (props: TypographyProps) => {
    const {
        id = "Text",
        children,
        style,
        variant = 'bodyRegular',
        center,
        color,
        opacity,
        size,
        weight,
        font,
        align,
        transform,


        marginBottom,
        marginTop,
        marginHorizontal,
        marginVertical,
        marginRight,
        marginLeft,
        paddingBottom,
        paddingTop,
        paddingHorizontal,
        paddingVertical,
        paddingRight,
        paddingLeft,
        ...rest
    } = props;

    const textStyles = StyleSheet.flatten([
        {
            // Базовые стили из темы
            ...TypographyStyles[variant],
            color: color || '#1A1A1A', // Используем цвет из props или дефолтный

            ...(marginBottom && {marginBottom}),
            ...(marginTop && {marginTop}),
            ...(marginHorizontal && {marginHorizontal}),
            ...(marginVertical && {marginVertical}),
            ...(marginRight && {marginRight}),
            ...(marginLeft && {marginLeft}),
            ...(paddingBottom && {paddingBottom}),
            ...(paddingTop && {paddingTop}),
            ...(paddingHorizontal && {paddingHorizontal}),
            ...(paddingVertical && {paddingVertical}),
            ...(paddingRight && {paddingRight}),
            ...(paddingLeft && {paddingLeft}),
            ...(center && {textAlign: "center"}),
            ...(align && {textAlign: align}),

            ...(weight && {fontWeight: weight}),
            ...(transform && {textTransform: transform}),
            ...(font && {fontFamily: font}),
            ...(size && {fontSize: size}),
            ...(opacity && {opacity}),

        },
        style,
    ]) as TextStyle;



    // generate component testID or accessibilityLabel based on Platform.OS
    const textID =
        Platform.OS === "android" ? {accessibilityLabel: id} : {testID: id};

    return (
        <Text {...textID} style={textStyles} {...rest}>
            {children}
        </Text>
    );
};

export default React.memo(Typography);
