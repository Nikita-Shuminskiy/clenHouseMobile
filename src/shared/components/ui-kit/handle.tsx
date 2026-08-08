import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { HARVEST_COLORS } from '../../harvest-theme';


interface HandleProps {
  style?: ViewStyle;
}

const Handle: React.FC<HandleProps> = ({ style }) => {
  return (
    <View style={[styles.container, HandleStyles.default, style]}>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  line: {
    width: 48,
    height: 4,
    backgroundColor: HARVEST_COLORS.bone,
    borderRadius: 8,
  },
});

export default Handle;
