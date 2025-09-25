import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/src/shared/components/ui-kit/button';
import { ThemeColors, ThemeFonts, ThemeWeights, useTheme } from '@/src/shared/use-theme';

interface PasswordResetSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onGoToLogin: () => void;
}

const PasswordResetSuccessModal: React.FC<PasswordResetSuccessModalProps> = ({
  visible,
  onClose,
  onGoToLogin,
}) => {
  const { colors, fonts, weights } = useTheme();
  const styles = createStyles({ colors, fonts, weights });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <TouchableOpacity style={styles.backdrop} onPress={onClose} />
          
          <View style={styles.bottomSheet}>
            {/* Handle */}
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
            
            <View style={styles.content}>
              {/* Icon placeholder */}
              <View style={styles.iconContainer} />
              
              {/* Text content */}
              <View style={styles.textContainer}>
                <Text style={styles.title}>Пароль успешно обновлён</Text>
                <Text style={styles.subtitle}>
                  Используйте новый пароль для входа
                </Text>
              </View>
            </View>
            
            {/* Button */}
            <View style={styles.buttonContainer}>
              <Button
                type="primary"
                onPress={onGoToLogin}
                containerStyle={styles.button}
              >
                На страницу входа
              </Button>
            </View>
          </View>
        </SafeAreaView>
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
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 4,
    paddingHorizontal: 16,
    paddingBottom: 34,
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
    gap: 16,
    marginBottom: 24,
  },
  iconContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#EFF3F8',
    borderRadius: 16,
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
  },
  button: {
    borderRadius: 16,
  },
});

export default PasswordResetSuccessModal;
