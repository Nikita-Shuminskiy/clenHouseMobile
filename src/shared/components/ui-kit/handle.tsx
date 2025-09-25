import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';


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
    backgroundColor: '#EAF0F6',
    borderRadius: 8,
  },
});

export default Handle;
