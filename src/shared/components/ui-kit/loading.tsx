import { useTheme } from '@/src/shared/use-theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'large', 
  color 
}) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      <ActivityIndicator 
        size={size} 
        color={color || colors.primary} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
