import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// import { useForgotPassword } from '@/src/modules/auth/api/use-forgot-password';
import Button from '@/src/shared/components/ui-kit/button';
import Input from '@/src/shared/components/ui-kit/input';
import { ThemeColors, ThemeFonts, ThemeWeights, useTheme } from '@/src/shared/use-theme';
import { TopBar } from '../../../shared/components/molecules/TopBar';

const ResetPasswordSuccessScreen: React.FC = () => {
  const { colors, sizes, fonts, weights } = useTheme();
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // const { mutateAsync: forgotPassword } = useForgotPassword();
  
  const styles = createStyles({ colors, sizes, fonts, weights });

  const handleContinue = async () => {
    if (!email) return;
    
    setIsLoading(true);
    try {
      // Используем заглушку API
      // await forgotPassword({ email });
      
      // Переходим на экран подтверждения с переданным email
      router.push(`/(auth)/(forgot-password)/forgot-password-confirmation?email=${encodeURIComponent(email)}` as any);
    } catch (error) {
      console.error('Ошибка при отправке запроса на восстановление пароля:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <TopBar title="Сброс пароля" />

      {/* Основной контент с закруглениями */}
      <View style={styles.content}>
        <View style={styles.formContainer}>
          {/* Заголовок и описание */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Забыли пароль?</Text>
            <Text style={styles.subtitle}>
              Введите email, привязанный к вашему{'\n'}аккаунту, чтобы сбросить пароль
            </Text>
          </View>

          {/* Поле ввода email */}
          <Input
            type="mail"
            placeholder="Введите email"
            value={email}
            onChangeText={setEmail}
            style={styles.emailInput}
          />
        </View>

        {/* Кнопка продолжить */}
        <Button
          type="primary"
          onPress={handleContinue}
          disabled={!email || false}
          containerStyle={styles.continueButton}
        >
          {false ? 'Отправка...' : 'Продолжить'}
        </Button>
      </View>
    </SafeAreaView>
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
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  formContainer: {
    gap: 24,
  },
  headerContainer: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: fonts.h2,
    fontWeight: weights.h2,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.5,
    color: colors.black,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.text2,
    fontWeight: weights.text2,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.5,
    color: colors.grey900,
    textAlign: 'center',
  },
  emailInput: {
    borderRadius: 16,
  },
  continueButton: {
    borderRadius: 16,
    paddingVertical: 16,
  },
});

export default ResetPasswordSuccessScreen;
