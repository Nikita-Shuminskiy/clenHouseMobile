import { router } from 'expo-router';
import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';

import OtpInputs from "react-native-otp-inputs";
import Button from '@/src/shared/components/ui-kit/button';
import { ThemeColors, ThemeFonts, ThemeWeights, useTheme } from '@/src/shared/use-theme';
import { useAuthStore } from '@/src/modules/auth/stores/auth.store';
import { TopBar } from '@/src/shared/components/molecules/TopBar';

const ConfirmCodeScreen: React.FC = () => {
  const { colors, sizes, fonts, weights } = useTheme();
  const styles = createStyles({ colors, sizes, fonts, weights });
  const [, setOtpCode] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0);
  const otpRef = useRef<any>(null);
  const { registrationData } = useAuthStore();

  const handleOtpChange = (code: string) => {
    setOtpCode(code);
    setIsError(false);
    
    if (code.length === 4) {
      handleVerifyCode(code);
    }
  };

  const handleVerifyCode = async (code: string) => {
    setIsLoading(true);
    try {
      // Здесь должна быть логика проверки кода
      // Например, вызов API для верификации
      console.log('Verifying code:', code);
      
      // Имитация API вызова
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Если код верный, переходим к следующему экрану
      router.push('/(auth)/registration-role' as any);
    } catch {
      setIsError(true);
      setKey(prevKey => prevKey + 1);
      Alert.alert('Ошибка', 'Неверный код подтверждения');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    // Логика повторной отправки кода
    console.log('Resending code...');
    Alert.alert('Код отправлен', 'Новый код подтверждения отправлен на ваш номер');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Top bar */}
      <TopBar title="Подтверждение" badge="2" maxBadge="3" />

      {/* Основной контент */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Заголовок и описание */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>
              Введите код{'\n'}подтверждения
            </Text>
            <Text style={styles.subtitle}>
              Мы отправили SMS с кодом{'\n'}на номер {registrationData?.email || '+7 (***) ***-**-**'}
            </Text>
          </View>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            <OtpInputs
              key={key}
              ref={otpRef}
              isRTL={false}
              onTouchStart={() => {
                if (isError) {
                  Clipboard.setString('');
                  setIsError(false);
                  setKey(prevKey => prevKey + 1);
                }
              }}
              handleChange={handleOtpChange}
              keyboardType="phone-pad"
              numberOfInputs={4}
              autofillFromClipboard
              style={styles.otpInputContainer}
              inputStyles={[
                styles.otpInput,
                isError && styles.otpInputError
              ]}
              focusStyles={[
                styles.otpInputFocus,
                isError && styles.otpInputError
              ]}
              selectionColor="transparent"
              editable={!isLoading}
            />
          </View>

          {/* Сообщение об ошибке */}
          {isError && (
            <Text style={styles.errorText}>
              Неверный код. Попробуйте еще раз
            </Text>
          )}

          {/* Кнопка повторной отправки */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Не получили код?{' '}
            </Text>
            <Button
              type="text"
              onPress={handleResendCode}
              disabled={isLoading}
              textStyle={styles.resendButtonText}
            >
              Отправить повторно
            </Button>
          </View>
        </View>
      </ScrollView>
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
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  formContainer: {
    gap: 32,
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
  otpContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  otpInput: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.grey300,
    backgroundColor: colors.white,
    textAlign: 'center',
    fontFamily: fonts.text1,
    fontWeight: weights.medium,
    fontSize: 18,
    color: colors.black,
  },
  otpInputFocus: {
    borderColor: colors.primary500,
    borderWidth: 2,
  },
  otpInputError: {
    borderColor: colors.red,
    borderWidth: 2,
  },
  errorText: {
    fontFamily: fonts.text3,
    fontWeight: weights.medium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.red,
    textAlign: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  resendText: {
    fontFamily: fonts.text3,
    fontWeight: weights.text3,
    fontSize: 14,
    lineHeight: 20,
    color: colors.grey700,
  },
  resendButtonText: {
    fontFamily: fonts.text3,
    fontWeight: weights.medium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.primary500,
  },
});

export default ConfirmCodeScreen;
