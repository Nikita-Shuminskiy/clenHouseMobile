import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { OTPInput } from 'input-otp-native';

import { useVerifySms } from '@/src/modules/auth/hooks/useVerifySms';
import { TopBar } from '@/src/shared/components/molecules/TopBar';
import Button from '@/src/shared/components/ui-kit/button';
import { router, useLocalSearchParams } from 'expo-router';

const ConfirmCodeScreen: React.FC = () => {
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();

  const { mutateAsync: verifySms } = useVerifySms();
  const [otpCode, setOtpCode] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      // Навигация происходит в хуке useVerifySms, не нужно дублировать
    } catch (error: any) {
      console.error('Ошибка верификации SMS:', error);
      setIsError(true);
      // Очищаем буфер обмена и сбрасываем OTP поле при ошибке
      await Clipboard.setStringAsync('');
      setOtpCode('');
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
            <OTPInput
              maxLength={6}
              value={otpCode}
              onChange={handleOtpChange}
              onComplete={handleVerifyCode}
              textAlign="center"
              editable={!isLoading}
              render={({ slots, isFocused }) => (
                <View style={styles.otpInputContainer}>
                  {slots.map((slot, index) => (
                    <View
                      key={index}
                      style={[
                        styles.otpInput,
                        slot.isActive && styles.otpInputFocus,
                        isError && styles.otpInputError,
                      ]}
                    >
                      <TextInput
                        value={slot.char || ''}
                        style={styles.otpInputText}
                        keyboardType="phone-pad"
                        maxLength={1}
                        editable={!isLoading}
                        selectTextOnFocus
                        onFocus={() => {
                          if (isError) {
                            setIsError(false);
                            setOtpCode('');
                          }
                        }}
                      />
                      {slot.hasFakeCaret && (
                        <View style={styles.caret} />
                      )}
                    </View>
                  ))}
                </View>
              )}
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
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  otpInputText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  caret: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: '#FC712C',
    borderRadius: 1,
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
