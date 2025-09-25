import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';


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
    borderTopColor: '#EAF0F6',
  },
});

export default Divider;
