import React from 'react';
import {
    Dimensions,
    Linking,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { ThemeColors, ThemeFonts, ThemeWeights, useTheme } from '@/src/shared/use-theme';
import { HARVEST_COLORS } from '../../harvest-theme';
import { LEGAL_DOCUMENTS } from '@/src/shared/legal/legal-documents';

interface PrivacyPolicyProps {
  containerStyle?: any;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ containerStyle }) => {
  const { colors, sizes, fonts, weights } = useTheme();
  const { height: screenHeight } = Dimensions.get('window');
  
  const isSmallScreen = screenHeight < 700;
  const styles = createStyles({ colors, sizes, fonts, weights });

  const openDocument = (url: string) => {
    Linking.openURL(url).catch(() => {
      // документ можно открыть на сайте вручную
    });
  };

  const handleOpenPrivacyPolicy = () => openDocument(LEGAL_DOCUMENTS.privacyPolicy.url);

  const handleOpenTerms = () => openDocument(LEGAL_DOCUMENTS.termsOfService.url);

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
    color: HARVEST_COLORS.driftwood,
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  linkText: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: HARVEST_COLORS.flame,
    textAlign: 'center',
  },
});

export default PrivacyPolicy;
