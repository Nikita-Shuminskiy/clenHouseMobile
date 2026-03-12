import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Clipboard from 'expo-clipboard';
import { OTPInput } from 'input-otp-native';

import { useVerifySms } from '@/src/modules/auth/hooks/useVerifySms';
import { useSendSms } from '@/src/modules/auth/hooks/useSendSms';
import Button from '@/src/shared/components/ui-kit/button';
import { BackArrowIcon } from '@/src/shared/components/icons';
import { router, useLocalSearchParams } from 'expo-router';


const OTP_CELL_COUNT = 6;
const OTP_GAP = 12;
const OTP_CELL_SIZE = 40;
const OTP_CONTAINER_HORIZONTAL = 20;
const SCREEN_PADDING = 16;

const ConfirmCodeScreen: React.FC = () => {
  const { width: screenWidth } = useWindowDimensions();
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();

  const { mutateAsync: verifySms } = useVerifySms();

  const containerMargin = Math.min(OTP_CONTAINER_HORIZONTAL, screenWidth * 0.05);
  const containerPadding = screenWidth < 360 ? 12 : 20;
  const availableWidth =
    screenWidth - SCREEN_PADDING * 2 - containerMargin * 2 - containerPadding * 2;
  const gap = screenWidth < 360 ? 6 : OTP_GAP;
  const totalGapWidth = gap * (OTP_CELL_COUNT - 1);
  const calculatedCellSize = Math.floor(
    (availableWidth - totalGapWidth) / OTP_CELL_COUNT,
  );
  const cellSize = Math.max(28, Math.min(OTP_CELL_SIZE, calculatedCellSize));
  const { mutateAsync: sendSms } = useSendSms();
  const [otpCode, setOtpCode] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleOtpChange = (code: string) => {
    setOtpCode(code);
    setIsError(false);
  };

  const handleVerifyCode = async (code: string) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setIsError(false);

    try {
      console.log('Verifying code:', code);
      console.log('Phone number:', phoneNumber);

      const res = await verifySms({
        phoneNumber: phoneNumber,
        code: code,
      });

      // Проверяем что ответ корректен
      if (!res || !res.accessToken || !res.refreshToken) {
        throw new Error('Некорректный ответ от сервера');
      }

      // Навигация происходит в хуке useVerifySms при успехе
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

  const handleResendCode = async () => {
    try {
      await sendSms({ phoneNumber, isDev: false });
      Alert.alert('Код отправлен', 'Новый код подтверждения отправлен на ваш номер');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось отправить код');
    }
  };

  const handleAutoFill = async () => {
    try {
      // Запрашиваем код с сервера в dev режиме
      const res = await sendSms({ phoneNumber, isDev: true });
      console.log('Auto-fill response:', res);

      // Если сервер возвращает код, используем его
      if (res && res.code) {
        setOtpCode(res.code);
        await handleVerifyCode(res.code);
      } else {
        Alert.alert('Информация', 'Проверьте код в консоли разработчика');
      }
    } catch (error) {
      console.error('Ошибка автозаполнения:', error);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <BackArrowIcon width={24} height={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Подтверждение</Text>
        </View>
        <View style={styles.backButton} />
      </View>

      {/* Основной контент */}
      <KeyboardAwareScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          {/* Заголовок и описание */}
          <View style={styles.headerContainer}>
            <Text style={styles.pageTitle}>
              Введите код{'\n'}подтверждения
            </Text>
            <Text style={styles.subtitle}>
              Мы отправили SMS с кодом{'\n'}на номер {phoneNumber}
            </Text>
          </View>

          {/* OTP Input */}
          <View
            style={[
              styles.otpContainer,
              { marginHorizontal: containerMargin, padding: containerPadding },
            ]}
          >
            <OTPInput
              maxLength={6}
              value={otpCode}
              onChange={handleOtpChange}
              onComplete={handleVerifyCode}
              textAlign="center"
              editable={!isLoading}
              render={({ slots }) => (
                <View style={[styles.otpInputContainer, { gap }]}>
                  {slots.map((slot, index) => (
                    <View
                      key={index}
                      style={[
                        styles.otpInput,
                        { width: cellSize, height: Math.min(56, cellSize + 16) },
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

          {/* Dev кнопка автозаполнения */}


          {/* <Button
            type="secondary"
            onPress={handleAutoFill}
            disabled={isLoading}
            style={styles.autoFillButton}
          >
            Автоввод (Dev)
          </Button> */}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFCFE',
  },
  header: {

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,


  },
  backButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 28,
    color: '#1A1A1A',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 50,
  },
  formContainer: {
    gap: 24,
  },
  headerContainer: {
    alignItems: 'center',
    gap: 8,
  },
  pageTitle: {
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
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  otpInput: {
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
  autoFillButton: {
    marginTop: 12,
  },
})

export default ConfirmCodeScreen;
