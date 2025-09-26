import React, { useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';

import { useVerifySms } from '@/src/modules/auth/hooks/useVerifySms';
import { TopBar } from '@/src/shared/components/molecules/TopBar';
import Button from '@/src/shared/components/ui-kit/button';
import { useLocalSearchParams } from 'expo-router';
import OtpInputs from "react-native-otp-inputs";

const ConfirmCodeScreen: React.FC = () => {
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();

  const { mutateAsync: verifySms } = useVerifySms();
  const [, setOtpCode] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0);
  const otpRef = useRef<any>(null);

  const handleOtpChange = (code: string) => {
    setOtpCode(code);
    setIsError(false);
    
    if (code.length === 6) {
      handleVerifyCode(code);
    }
  };

  const handleVerifyCode = async (code: string) => {
    setIsLoading(true);
    try {
      console.log('Verifying code:', code);
      console.log(phoneNumber, "phoneNumber");
      
      const res = await verifySms({
        phoneNumber: phoneNumber, // Номер уже в правильном формате +7XXXXXXXXXX
        code: code,
      });
      console.log(res);
      // Успешная верификация - пользователь будет перенаправлен автоматически
    } catch (error: any) {
      console.error('Ошибка верификации SMS:', error);
      setIsError(true);
      // Очищаем буфер обмена и сбрасываем OTP поле при ошибке
      await Clipboard.setStringAsync('');
      setKey(prevKey => prevKey + 1);
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
              Мы отправили SMS с кодом{'\n'}на номер {phoneNumber}
            </Text>
          </View>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            <OtpInputs
              key={key}
              ref={otpRef}
              isRTL={false}
              onTouchStart={async () => {
                if (isError) {
                  await Clipboard.setStringAsync('');
                  setIsError(false);
                  setKey(prevKey => prevKey + 1);
                }
              }}
              handleChange={handleOtpChange}
              keyboardType="phone-pad"
              numberOfInputs={6}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.5,
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.5,
    color: '#000',
    textAlign: 'center',
  },
  otpContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  otpInput: {
    width: 40,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1EAF0',
    backgroundColor: '#fff',
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
  },
  otpInputFocus: {
    borderColor: '#FC712C',
    borderWidth: 1,
    borderRadius: 12,
  },
  otpInputError: {
    borderColor: '#FF0000',
    borderWidth: 1,
    borderRadius: 12,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#FF0000',
    textAlign: 'center',
    fontWeight: '500',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  resendText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000',
  },
  resendButtonText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000',
  },
})

export default ConfirmCodeScreen;
