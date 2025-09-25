import React from 'react';
import {
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';


interface MetroMarkProps {
  color: MetroMarkColor;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
}

const MetroMark: React.FC<MetroMarkProps> = ({
  color,
  style,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, MetroMarkContainerStyles.default, containerStyle]}>
      <View style={[styles.mark, MetroMarkStyles[color], style]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MetroMark;
