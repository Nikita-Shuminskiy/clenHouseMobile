import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { HARVEST_COLORS } from '../../harvest-theme';


interface DividerProps {
  style?: ViewStyle;
}

const Divider: React.FC<DividerProps> = ({ style }) => {
  return (
    <View style={[styles.container, DividerStyles.default, style]} />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 0,
    borderTopWidth: 1,
    borderTopColor: HARVEST_COLORS.mist,
  },
});

export default Divider;
