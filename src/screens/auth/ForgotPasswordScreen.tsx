import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// import { useResetPasswordRequest } from '@/src/modules/auth/api/use-reset-password-request';
import Button from '@/src/shared/components/ui-kit/button';
import ControlledInput from '@/src/shared/components/ui-kit/controlled-input';
import { ResetPasswordRequestFormData, resetPasswordRequestSchema } from '@/src/shared/schemas/auth-schemas';
import { ThemeColors, ThemeFonts, ThemeWeights, useTheme } from '@/src/shared/use-theme';
import { TopBar } from '../../shared/components/molecules/TopBar';
import { KeyboardScrollView } from './ui/KeyboardScrollView';

const ForgotPasswordScreen: React.FC = () => {
  const { colors, sizes, fonts, weights } = useTheme();

  // const { mutateAsync: resetPasswordRequest, isPending } = useResetPasswordRequest();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<ResetPasswordRequestFormData>({
    resolver: yupResolver(resetPasswordRequestSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const styles = createStyles({ colors, sizes, fonts, weights });

  const onSubmit = async (data: ResetPasswordRequestFormData) => {
    try {
      // await resetPasswordRequest(data);

      router.push(`/(auth)/(forgot-password)/forgot-password-confirmation?email=${encodeURIComponent(data.email)}` as any);
    } catch (error) {
      console.error('Ошибка при отправке запроса на восстановление пароля:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <TopBar title="Восстановление доступа" />

      <KeyboardScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Забыли пароль?</Text>
          <Text style={styles.subtitle}>
            Введите email, привязанный к аккаунту,{'\n'} чтобы восстановить доступ
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <ControlledInput
            control={control}
            name="email"
            type="mail"
            label="Почта"
            placeholder="Введите email"
            error={errors.email}
          />
        </View>

        <Button
          type="primary"
          onPress={handleSubmit(onSubmit)}
          disabled={false || !isValid}
          isLoading={false}
          containerStyle={styles.continueButton}
        >
          {false ? 'Отправка...' : 'Сбросить пароль'}
        </Button>
      </KeyboardScrollView>
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
    paddingTop: 32,
    paddingBottom: 24,
  },
  headerContainer: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 32,
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
  continueButton: {
    borderRadius: 16,
    paddingVertical: 16,
  },
});

export default ForgotPasswordScreen;
