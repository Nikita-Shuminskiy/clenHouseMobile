import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

import Handle from './handle';

interface BottomSheetProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonPress?: () => void;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  title,
  description,
  buttonText,
  onButtonPress,
  style,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.bottomSheet, BottomSheetContainerStyles.default, style]}>
        {/* Основной блок */}
        <View style={[styles.mainBlock, BottomSheetMainBlockStyles.default]}>
          {/* Handle */}
          <Handle />
          
          {/* Контент */}
          <View style={styles.content}>
            {/* Заголовок */}
            <Text style={[styles.title, BottomSheetTitleStyles.default]}>
              {title}
            </Text>
            
            {/* Описание */}
            <Text style={[styles.description, BottomSheetDescriptionStyles.default]}>
              {description}
            </Text>
          </View>
          
          {/* Кнопка */}
          {onButtonPress && (
            <TouchableOpacity
              style={[styles.button, BottomSheetButtonStyles.default]}
              onPress={onButtonPress}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, BottomSheetButtonTextStyles.default]}>
                {buttonText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheet: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    alignSelf: 'stretch',
    gap: 8,
    padding: 8,
  },
  title: {
    textAlign: 'left',
  },
  description: {
    textAlign: 'left',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
  },
});

export default BottomSheet;
