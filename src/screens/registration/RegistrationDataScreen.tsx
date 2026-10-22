import { TopBar } from '@/src/shared/components/molecules/TopBar';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/src/shared/components/ui-kit/button';
import ControlledInput from '@/src/shared/components/ui-kit/controlled-input';
import PhoneInput from '@/src/shared/components/ui-kit/phone-input';
import {
  RegistrationDataFormData,
  registrationDataSchema,
} from '@/src/shared/schemas/auth-schemas';
import { useTheme } from '@/src/shared/use-theme';
import { KeyboardScrollView } from '../auth/ui/KeyboardScrollView';
import { useRegisterByEmail } from '@/src/modules/auth/hooks/useRegisterByEmail';
import { authApi } from '@/src/modules/auth/api';
import LegalConsents, {
  EMPTY_LEGAL_CONSENTS,
  hasRequiredConsents,
  LegalConsentsState,
} from '@/src/shared/components/legal/LegalConsents';
import { LEGAL_REVISION } from '@/src/shared/legal/legal-documents';

export const RegistrationDataScreen: React.FC = () => {
  const { colors, fonts, weights, sizes } = useTheme();
  const styles = createStyles({ colors, fonts, weights, sizes });
  const { mutateAsync: registerByEmail, isPending } = useRegisterByEmail();
  // Согласия даются до передачи персональных данных
  const [consents, setConsents] =
    React.useState<LegalConsentsState>(EMPTY_LEGAL_CONSENTS);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegistrationDataFormData>({
    resolver: yupResolver(registrationDataSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const watchedFields = watch();
  const isFormValid =
    watchedFields.name.trim() !== '' &&
    watchedFields.email.trim() !== '' &&
    watchedFields.phone.trim() !== '' &&
    watchedFields.password.trim() !== '' &&
    hasRequiredConsents(consents) &&
    isValid;

  const onSubmit = async (data: RegistrationDataFormData) => {
    if (!hasRequiredConsents(consents)) {
      return;
    }

    const phoneDigits = data.phone.replace(/\D/g, '');
    await registerByEmail({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: `+7${phoneDigits}`,
      password: data.password.trim(),
    });

    // Фиксируем дату и состав согласий после успешной регистрации
    authApi
      .saveConsents({
        terms: consents.terms,
        personalData: consents.personalData,
        marketing: consents.marketing,
        revision: LEGAL_REVISION,
      })
      .catch((error) => {
        console.error('Не удалось сохранить согласия пользователя:', error);
      });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <TopBar title="Регистрация" />

      <KeyboardScrollView>
        <View style={styles.formContainer}>
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: colors.black }]}>
              Регистрация
            </Text>
            <Text style={[styles.subtitle, { color: colors.grey900 }]}>
              Заполните данные, чтобы создать аккаунт
            </Text>
          </View>

          <View style={styles.fieldsContainer}>
            <ControlledInput
              control={control}
              name="name"
              label="Имя"
              placeholder="Введите имя"
              error={errors.name}
            />
            <ControlledInput
              control={control}
              name="email"
              label="Почта"
              placeholder="Введите email"
              error={errors.email}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <PhoneInput
                  label="Номер телефона"
                  value={value}
                  onChangeText={(masked, unmasked) => onChange(unmasked)}
                  validateOnBlur={true}
                  required={true}
                  error={errors.phone ? { message: errors.phone.message } : undefined}
                />
              )}
            />
            <ControlledInput
              control={control}
              name="password"
              label="Пароль"
              placeholder="Введите пароль"
              type="password"
              error={errors.password}
            />
          </View>
        </View>

        <View style={styles.consentsContainer}>
          <LegalConsents value={consents} onChange={setConsents} />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            onPress={() => handleSubmit(onSubmit)()}
            isLoading={isPending}
            disabled={!isFormValid || isPending}
          >
            Зарегистрироваться
          </Button>
        </View>
      </KeyboardScrollView>
    </SafeAreaView>
  );
};

const createStyles = ({
  colors,
  sizes,
  fonts,
  weights,
}: {
  colors: any;
  sizes: any;
  fonts: any;
  weights: any;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    formContainer: {
      flex: 1,
      gap: 24,
      paddingBottom: 32,
    },
    headerContainer: {
      alignItems: 'center',
      gap: 8,
    },
    title: {
      fontFamily: fonts.h2,
      fontWeight: weights.medium,
      fontSize: 20,
      lineHeight: 28,
      letterSpacing: 0,
      textAlign: 'center',
    },
    subtitle: {
      fontFamily: fonts.text2,
      fontWeight: weights.normal,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0,
      textAlign: 'center',
    },
    fieldsContainer: {
      gap: 16,
      width: '100%',
    },
    consentsContainer: {
      paddingBottom: 16,
    },
    buttonContainer: {
      paddingBottom: 16,
    },
  });

export default RegistrationDataScreen;
