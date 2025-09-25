import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

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
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    shadowColor: '#1A1A1A',
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.05,
    shadowRadius: 50,
    elevation: 6,
  },
  dot: {
    borderRadius: 100,
  },
  activeDot: {
    width: 24,
    height: 6,
    backgroundColor: '#1A1A1A',
  },
  inactiveDot: {
    width: 6,
    height: 6,
    backgroundColor: '#C8D2E5',
  },
});

export default OnboardingPagination;
