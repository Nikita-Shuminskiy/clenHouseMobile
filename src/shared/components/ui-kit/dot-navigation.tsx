import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';


interface DotNavigationProps {
  dots: DotState[];
  activeIndex?: number;
  onDotPress?: (index: number) => void;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
}

const DotNavigation: React.FC<DotNavigationProps> = ({
  dots,
  activeIndex = 0,
  onDotPress,
  style,
  containerStyle,
}) => {
  const handleDotPress = (index: number) => {
    onDotPress?.(index);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.dotBar, DotBarStyles.default, style]}>
        {dots.map((dot, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              DotStyles[dot],
              index === activeIndex && DotStyles.active,
            ]}
            onPress={() => handleDotPress(index)}
            activeOpacity={0.7}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotBar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DotNavigation;
