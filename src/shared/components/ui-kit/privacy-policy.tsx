import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { ThemeColors, ThemeFonts, ThemeWeights, useTheme } from '@/src/shared/use-theme';

interface PrivacyPolicyProps {
  containerStyle?: any;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ containerStyle }) => {
  const { colors, sizes, fonts, weights } = useTheme();
  const { height: screenHeight } = Dimensions.get('window');
  
  const isSmallScreen = screenHeight < 700;
  const styles = createStyles({ colors, sizes, fonts, weights });

  const handleOpenPrivacyPolicy = () => {
    // Заглушка - ничего не делаем
    console.log('Нажата ссылка "Политика конфиденциальности"');
  };

  const handleOpenTerms = () => {
    // Заглушка - ничего не делаем
    console.log('Нажата ссылка "Пользовательское соглашение"');
  };

  return (
    <View style={[
      styles.container,
      {
        marginTop: isSmallScreen ? sizes.md : 32,
        paddingHorizontal: sizes.m,
      },
      containerStyle
    ]}>
      <Text style={styles.agreementText}>
        Продолжая вы принимаете условия{'\n'}
        <Text onPress={handleOpenTerms} style={styles.linkText}>
          Пользовательского соглашения
        </Text>
        {'\n'}и{' '}
        <Text onPress={handleOpenPrivacyPolicy} style={styles.linkText}>
          Политики конфиденциальности
        </Text>
      </Text>
    </View>
  );
};

const createStyles = ({ 
  colors, 
  sizes, 
  fonts, 
  weights 
}: {
  colors: ThemeColors;
  sizes: any;
  fonts: ThemeFonts;
  weights: ThemeWeights;
}) => StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  agreementText: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16, // 1.33 ratio как в дизайне
    color: '#7D8EAA',
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  linkText: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: '#1A1A1A', // Черный цвет для ссылок
    textAlign: 'center',
  },
});

export default PrivacyPolicy;
