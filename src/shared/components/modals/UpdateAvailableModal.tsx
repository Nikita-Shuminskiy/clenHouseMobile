import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import Button from '@/src/shared/components/ui-kit/button';
import { ThemeColors, ThemeFonts, ThemeWeights, useTheme } from '@/src/shared/use-theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface UpdateAvailableModalProps {
  visible: boolean;
  isDownloading: boolean;
  onClose: () => void;
  onApply: () => Promise<void>;
}

const UpdateAvailableModal: React.FC<UpdateAvailableModalProps> = ({
  visible,
  isDownloading,
  onClose,
  onApply,
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
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} disabled={isDownloading} />
        
        <View style={styles.bottomSheet}>
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
          
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Доступно обновление</Text>
              <Text style={styles.subtitle}>
                {isDownloading
                  ? 'Загрузка обновления...'
                  : 'Доступна новая версия приложения. Рекомендуем обновиться для получения последних улучшений и исправлений.'}
              </Text>
            </View>
            
            {isDownloading && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}
          </View>
          
          <View style={styles.buttonContainer}>
            {!isDownloading && (
              <Button
                type="secondary"
                onPress={onClose}
                containerStyle={styles.button}
              >
                Позже
              </Button>
            )}
            <Button
              type="primary"
              onPress={onApply}
              containerStyle={styles.button}
              disabled={isDownloading}
            >
              {isDownloading ? 'Загрузка...' : 'Обновить'}
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
  loaderContainer: {
    marginTop: 16,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    flexDirection: 'row',
  },
  button: {
    borderRadius: 16,
    flex: 1,
  },
});

export default UpdateAvailableModal;
