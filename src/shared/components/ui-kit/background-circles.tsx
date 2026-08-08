// import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HARVEST_COLORS } from '@/src/shared/harvest-theme';

interface BackgroundCirclesProps {
  variant?: 'welcome' | 'search' | 'services';
  style?: ViewStyle;
}

const BackgroundCircles: React.FC<BackgroundCirclesProps> = ({
  variant = 'welcome',
  style,
}) => {

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={['rgba(250, 93, 0, 0.28)', 'rgba(254, 227, 181, 0.45)', 'rgba(255, 248, 241, 0)']}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
        style={styles.wash}
      />
      <View style={styles.paperLift} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: "100%",
    height: "100%",
    top: -40,
  },
  wash: {
    position: 'absolute',
    left: -80,
    right: -80,
    top: 30,
    height: 420,
    borderRadius: 220,
    transform: [{ rotate: '-8deg' }],
  },
  paperLift: {
    position: 'absolute',
    left: 28,
    right: 28,
    top: 170,
    height: 210,
    borderRadius: 20,
    backgroundColor: HARVEST_COLORS.paper,
    opacity: 0.58,
  },
});

export default BackgroundCircles;
