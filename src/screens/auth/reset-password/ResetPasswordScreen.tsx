import { yupResolver } from '@hookform/resolvers/yup';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useResetPassword } from '@/src/modules/auth/api/use-reset-password';
import { useVerifyResetCode } from '@/src/modules/auth/api/use-verify-reset-code';
import { CheckIcon, ErrorIcon, InfoCircleIcon } from '@/src/shared/components/icons';
import PasswordResetSuccessModal from '@/src/shared/components/modals/PasswordResetSuccessModal';
import Button from '@/src/shared/components/ui-kit/button';
import ControlledInput from '@/src/shared/components/ui-kit/controlled-input';
import { ResetPasswordFormData, resetPasswordSchema } from '@/src/shared/schemas/auth-schemas';
import { ThemeColors, ThemeFonts, ThemeWeights, useTheme } from '@/src/shared/use-theme';
import { TopBar } from '../../../shared/components/molecules/TopBar';

const ResetPasswordScreen: React.FC = () => {
  const { colors, sizes, fonts, weights } = useTheme();
  const { email, code } = useLocalSearchParams<{ email: string; code: string }>();
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const { mutateAsync: resetPassword, isPending } = useResetPassword();
  const { mutateAsync: verifyCode } = useVerifyResetCode();
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      email: email || '',
      code: code || '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  // Проверяем наличие email и code при загрузке экрана
  useEffect(() => {
    if (!email || !code) {
      console.error('Отсутствуют email или code, возвращаемся назад');
      router.back();
    }
  }, [email, code]);
  
  const newPasswordValue = watch('newPassword');
  
  const styles = createStyles({ colors, sizes, fonts, weights });

  // Валидация пароля для отображения индикаторов
  const passwordValidation = {
    minLength: newPasswordValue.length >= 8,
    hasNumber: /\d/.test(newPasswordValue),
    hasUpperCase: /[A-ZА-Я]/.test(newPasswordValue),
  };

  // Функция для получения иконки валидации
  const getValidationIcon = (isValid: boolean) => {
    if (isValid) {
      return <CheckIcon width={16} height={16} color="#4ADE80" />;
    }
    return <InfoCircleIcon width={16} height={16} color="#A1B0CA" />;
  };

  // Функция для получения иконки ошибки
  const getErrorIcon = () => {
    return <ErrorIcon width={16} height={16} color="#F53F3F" />;
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword(data);
      // Показываем модалку успеха вместо перехода на другой экран
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGoToLogin = () => {
    setShowSuccessModal(false);
    router.push('/(auth)/' as any);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  const handleSignIn = () => {
    router.push('/(auth)/' as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <TopBar title="Сброс пароля" />

      {/* Основной контент */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Основной контент */}
        <View style={styles.mainContainer}>
          {/* Заголовок и описание */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Придумайте новый пароль</Text>
            <Text style={styles.subtitle}>
              Введите новый пароль для вашего аккаунта
            </Text>
          </View>
          
          {/* Поля ввода паролей */}
          <View style={styles.fieldsContainer}>
                                {/* Поле нового пароля */}
                    <View style={styles.inputGroup}>
                      <ControlledInput
                        control={control}
                        name="newPassword"
                        type="password"
                        label="Новый пароль"
                        placeholder="Введите новый пароль"
                        error={errors.newPassword}
                      />
              
              {/* Индикаторы валидации */}
              <View style={styles.validationContainer}>
                <View style={styles.validationItem}>
                  {getValidationIcon(passwordValidation.minLength)}
                  <Text style={[styles.validationText, passwordValidation.minLength && styles.validationTextValid]}>
                    Минимум 8 символов
                  </Text>
                </View>
                <View style={styles.validationItem}>
                  {getValidationIcon(passwordValidation.hasNumber)}
                  <Text style={[styles.validationText, passwordValidation.hasNumber && styles.validationTextValid]}>
                    Используйте хотя бы одну цифру
                  </Text>
                </View>
                <View style={styles.validationItem}>
                  {getValidationIcon(passwordValidation.hasUpperCase)}
                  <Text style={[styles.validationText, passwordValidation.hasUpperCase && styles.validationTextValid]}>
                    Используйте хотя бы одну заглавную букву
                  </Text>
                </View>
              </View>
            </View>

                                {/* Поле подтверждения пароля */}
                    <View style={styles.inputGroup}>
                      <ControlledInput
                        control={control}
                        name="confirmPassword"
                        type="password"
                        label="Повторите пароль"
                        placeholder="Введите ещё раз"
                        error={errors.confirmPassword}
                      />
                    </View>
          </View>
        </View>

        {/* Кнопки */}
        <View style={styles.buttonContainer}>
          <Button
            type="primary"
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            containerStyle={styles.updateButton}
          >
            {isPending ? 'Обновление...' : 'Обновить пароль'}
          </Button>
          
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Вспомнили пароль?</Text>
            <TouchableOpacity onPress={handleSignIn} style={styles.signInButton}>
              <Text style={styles.signInButtonText}>Войти</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Модалка успешного обновления пароля */}
        <PasswordResetSuccessModal
          visible={showSuccessModal}
          onClose={handleCloseModal}
          onGoToLogin={handleGoToLogin}
        />
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 32,
  },
  mainContainer: {
    alignItems: 'center',
    gap: 24,
  },
  headerContainer: {
    alignItems: 'center',
    gap: 8,
  },
  fieldsContainer: {
    gap: 16,
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
  inputGroup: {
    gap: 12,
    width: '100%',
  },
  validationContainer: {
    gap: 8,
  },
  validationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  validationText: {
    fontFamily: fonts.text3,
    fontWeight: weights.normal,
    fontSize: 12,
    lineHeight: 16,
    color: colors.grey500,
  },
  validationTextValid: {
    color: colors.primary600,
  },
  validationTextError: {
    fontFamily: fonts.text3,
    fontWeight: weights.normal,
    fontSize: 12,
    lineHeight: 16,
    color: '#F53F3F',
  },
  buttonContainer: {
    gap: 16,
  },
  updateButton: {
    borderRadius: 16,
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  signInText: {
    fontFamily: fonts.text2,
    fontWeight: weights.normal,
    fontSize: 14,
    lineHeight: 20,
    color: colors.grey900,
  },
  signInButton: {
    paddingVertical: 12,
  },
  signInButtonText: {
    fontFamily: fonts.text2,
    fontWeight: weights.medium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.primary600,
  },
});

export default ResetPasswordScreen;