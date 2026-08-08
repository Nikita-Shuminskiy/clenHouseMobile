import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { ArrowLeftIcon } from "@/src/shared/components/icons";
import { ThemeColors, ThemeFonts, ThemeSizes, ThemeWeights, useTheme } from "@/src/shared/use-theme";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HARVEST_SHADOWS } from "@/src/shared/harvest-theme";

export const TopBar = ({
  title,
  badge,
  maxBadge,
}: {
  title: string;
  badge?: string;
  maxBadge?: string;
}) => {
  const { colors, sizes, fonts, weights } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = createStyles({ colors, sizes, fonts, weights, insets });


  const handleBack = () => {
    router.back();
  };
  return (
    <View style={styles.topBar}>
      <View style={badge && maxBadge ? styles.topBarContentWithBadge : styles.topBarContent}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeftIcon width={24} height={24} color={String(colors.black)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        {
          badge && maxBadge && (
            <View style={styles.badge}>
            <Text style={styles.badgeText}>
              <Text style={styles.badgeTextActive}>{badge}</Text>{maxBadge && `/${maxBadge}`}
            </Text>
          </View>
          )
        }
      </View>
    </View>
  );
};

const createStyles = ({
  colors,
  sizes,
  fonts,
  weights,
  insets,
}: {
  colors: ThemeColors;
  sizes: ThemeSizes;
  fonts: ThemeFonts;
  weights: ThemeWeights;
  insets: { top: number; bottom: number; left: number; right: number };
}) => {
  return StyleSheet.create({
    topBar: {
      backgroundColor: colors.white,
      paddingTop: Platform.OS === 'ios' ? insets.top + 2 : insets.top + 1,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      borderWidth: 1,
      borderColor: colors.grey300,
      ...HARVEST_SHADOWS.card,
    },
    topBarContent: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: Platform.OS === 'android' ? 26 : 26,
      paddingLeft: 26,
      paddingRight: 16,
      position: "relative",
    },
    topBarContentWithBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Platform.OS === 'android' ? 16 : 16,
      paddingLeft: 26,
      paddingRight: 16,
      position: 'relative',
      justifyContent: 'space-between',
    },
    backButton: {
      padding: 0,
      zIndex: 1,
    },
    headerTitle: {
      position: "absolute",
      left: 0,
      right: 0,
      fontFamily: fonts.text3,
      fontWeight: weights.medium,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0,
      color: colors.black,
      textAlign: "center",
    },
    badge: {
      backgroundColor: colors.grey100,
      borderRadius: 100,
      paddingHorizontal: 8,
      paddingVertical: 4,
      zIndex: 1,
    },
    badgeText: {
      fontFamily: fonts.text3,
      fontWeight: weights.medium,
      fontSize: 12,
      lineHeight: 16,
      color: colors.muted, // Используем muted цвет для неактивного текста
    },
    badgeTextActive: {
      color: colors.primary500, // Основной цвет из веб-версии
    },
  });
};
