// import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View, ViewStyle, Image } from 'react-native';

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
      <Image
        source={require('../../../../assets/images/bg-onbording.png')}
        style={styles.circle}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: "100%",
    height: "100%",
    top: -120,




  },
  circle: {
    width: "100%",
    height: "100%",
  },

});

export default BackgroundCircles;
