import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import Button from '@/src/shared/components/ui-kit/button';
import { ThemeColors, ThemeFonts, ThemeWeights, useTheme } from '@/src/shared/use-theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StartOrderModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const StartOrderModal: React.FC<StartOrderModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const { colors, fonts, weights } = useTheme();
  const styles = createStyles({ colors, fonts, weights });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        
        <View style={styles.bottomSheet}>
          {/* Handle */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
          
          <View style={styles.content}>
            {/* Text content */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>Начать заказ</Text>
              <Text style={styles.subtitle}>
                Вы уверены, что хотите начать этот заказ?
              </Text>
            </View>
          </View>
          
          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              type="secondary"
              onPress={onClose}
              containerStyle={styles.button}
            >
              Отмена
            </Button>
            <Button
              type="primary"
              onPress={onConfirm}
              containerStyle={styles.button}
            >
              Начать
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = ({ 
  colors, 
  fonts, 
  weights 
}: {
  colors: ThemeColors;
  fonts: ThemeFonts;
  weights: ThemeWeights;
}) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 4,
    paddingHorizontal: 16,
    paddingBottom: 34,
    maxHeight: SCREEN_HEIGHT * 0.5,
    shadowColor: colors.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 50,
    elevation: 6,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  handle: {
    width: 48,
    height: 4,
    backgroundColor: '#EAF0F6',
    borderRadius: 8,
  },
  content: {
    alignItems: 'center',
    marginBottom: 24,
  },
  textContainer: {
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  title: {
    fontFamily: fonts.h2,
    fontWeight: weights.medium,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.5,
    color: colors.black,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.text2,
    fontWeight: weights.normal,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.5,
    color: colors.grey900,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    borderRadius: 16,
  },
});

export default StartOrderModal;

