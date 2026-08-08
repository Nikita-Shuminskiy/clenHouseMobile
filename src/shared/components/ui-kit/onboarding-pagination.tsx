import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { HARVEST_COLORS, HARVEST_SHADOWS } from '@/src/shared/harvest-theme';

interface OnboardingPaginationProps {
  totalSlides: number;
  currentSlide: number;
  style?: ViewStyle;
}

const OnboardingPagination: React.FC<OnboardingPaginationProps> = ({
  totalSlides,
  currentSlide,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: totalSlides }, (_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentSlide ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    backgroundColor: HARVEST_COLORS.paper,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: HARVEST_COLORS.mist,
    ...HARVEST_SHADOWS.card,
  },
  dot: {
    borderRadius: 100,
  },
  activeDot: {
    width: 24,
    height: 6,
    backgroundColor: HARVEST_COLORS.flame,
  },
  inactiveDot: {
    width: 6,
    height: 6,
    backgroundColor: HARVEST_COLORS.bone,
  },
});

export default OnboardingPagination;
