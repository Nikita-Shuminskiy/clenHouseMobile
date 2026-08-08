import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useLoginByEmail } from '@/src/modules/auth/hooks/useLoginByEmail';
import { useLoginByTelegram } from '@/src/modules/auth/hooks/useLoginByTelegram';
import type { VerifyTelegramRequest } from '@/src/modules/auth/types';
import { TelegramIcon } from '@/src/shared/components/icons';
import { HARVEST_COLORS, HARVEST_SHADOWS } from '@/src/shared/harvest-theme';
import { TelegramLoginModal } from './components/TelegramLoginModal';

type LoginMode = 'customer' | 'courier';

export const AuthScreen = () => {
  const [mode, setMode] = useState<LoginMode>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const [isTelegramModalVisible, setIsTelegramModalVisible] = useState(false);
  const loginByEmail = useLoginByEmail();
  const loginByTelegram = useLoginByTelegram();

  const isCourier = mode === 'courier';
  const isAuthPending = loginByEmail.isPending || loginByTelegram.isPending;
  const isDisabled =
    isAuthPending || email.trim().length === 0 || password.length === 0;

  const copy = useMemo(
    () =>
      isCourier
        ? {
            eyebrow: 'для курьеров',
            title: 'Вход курьера',
            subtitle: 'Принимайте заказы и обновляйте статусы доставки',
            switchText: 'Войти как клиент',
          }
        : {
            eyebrow: 'для клиентов',
            title: 'Вход клиента',
            subtitle: 'Создавайте заказы, оплачивайте и управляйте подпиской',
            switchText: 'Вход для курьера',
          },
    [isCourier],
  );

  const handleSubmit = () => {
    if (isDisabled) {
      return;
    }

    loginByEmail.mutate({
      email: email.trim(),
      password,
    });
  };

  const handleTelegramAuth = (payload: VerifyTelegramRequest) => {
    setIsTelegramModalVisible(false);
    loginByTelegram.mutate(payload);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <View style={styles.brandMark}>
              <View style={styles.brandIconWrap}>
                <Text style={styles.brandIcon}>⌂</Text>
              </View>
              <View>
                <Text style={styles.brandTitle}>Чисто дома</Text>
                <Text style={styles.brandSubtitle}>Вывоз вещей без лишнего шума</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.heading}>
              <Text style={styles.eyebrow}>{copy.eyebrow}</Text>
              <Text style={styles.title}>{copy.title}</Text>
              <Text style={styles.subtitle}>{copy.subtitle}</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              disabled={isAuthPending}
              onPress={() => setIsTelegramModalVisible(true)}
              style={({ pressed }) => [
                styles.telegramButton,
                isAuthPending && styles.telegramButtonDisabled,
                pressed && !isAuthPending && styles.primaryButtonPressed,
              ]}
            >
              <TelegramIcon
                width={18}
                height={18}
                color={
                  isAuthPending
                    ? HARVEST_COLORS.smoke
                    : HARVEST_COLORS.flame
                }
              />
              <Text
                style={[
                  styles.telegramButtonText,
                  isAuthPending && styles.telegramButtonTextDisabled,
                ]}
              >
                {loginByTelegram.isPending
                  ? 'Входим через Telegram...'
                  : 'Войти через Telegram'}
              </Text>
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>или</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  inputMode="email"
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder="Введите email"
                  placeholderTextColor={HARVEST_COLORS.driftwood}
                  returnKeyType="next"
                  style={styles.input}
                  value={email}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Пароль</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    autoCapitalize="none"
                    autoComplete="password"
                    autoCorrect={false}
                    onChangeText={setPassword}
                    placeholder="Введите пароль"
                    placeholderTextColor={HARVEST_COLORS.driftwood}
                    returnKeyType="done"
                    secureTextEntry={securePassword}
                    style={styles.passwordInput}
                    value={password}
                    onSubmitEditing={handleSubmit}
                  />
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setSecurePassword((value) => !value)}
                    style={styles.eyeButton}
                  >
                    <Text style={styles.eyeText}>
                      {securePassword ? 'Показать' : 'Скрыть'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              disabled={isDisabled}
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.primaryButton,
                isDisabled && styles.primaryButtonDisabled,
                pressed && !isDisabled && styles.primaryButtonPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {loginByEmail.isPending ? 'Входим...' : 'Войти'}
              </Text>
            </Pressable>

            {!isCourier && (
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/registration-profile')}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>Создать аккаунт</Text>
              </Pressable>
            )}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => setMode(isCourier ? 'customer' : 'courier')}
            style={styles.roleSwitch}
          >
            <Text style={styles.roleSwitchText}>{copy.switchText}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
      <TelegramLoginModal
        visible={isTelegramModalVisible}
        isLoading={loginByTelegram.isPending}
        onClose={() => setIsTelegramModalVisible(false)}
        onAuth={handleTelegramAuth}
      />
    </SafeAreaView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: HARVEST_COLORS.canvas,
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  hero: {
    paddingTop: 12,
    paddingBottom: 18,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: HARVEST_COLORS.paper,
    borderColor: HARVEST_COLORS.mist,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 82,
    paddingHorizontal: 18,
    ...HARVEST_SHADOWS.card,
  },
  brandIconWrap: {
    alignItems: 'center',
    backgroundColor: HARVEST_COLORS.softCream,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  brandIcon: {
    color: HARVEST_COLORS.flame,
    fontSize: 24,
    fontWeight: '800',
  },
  brandTitle: {
    color: HARVEST_COLORS.ink,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
  },
  brandSubtitle: {
    color: HARVEST_COLORS.stone,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  card: {
    backgroundColor: HARVEST_COLORS.paper,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: HARVEST_COLORS.mist,
    ...HARVEST_SHADOWS.card,
  },
  heading: {
    alignItems: 'center',
    marginBottom: 22,
  },
  eyebrow: {
    color: HARVEST_COLORS.flame,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  title: {
    color: HARVEST_COLORS.ink,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    marginTop: 6,
    textAlign: 'center',
  },
  subtitle: {
    color: HARVEST_COLORS.stone,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    maxWidth: 270,
    textAlign: 'center',
  },
  telegramButton: {
    alignItems: 'center',
    backgroundColor: HARVEST_COLORS.softCream,
    borderColor: HARVEST_COLORS.marigoldGlow,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    height: 48,
    justifyContent: 'center',
  },
  telegramButtonDisabled: {
    backgroundColor: HARVEST_COLORS.warmPanel,
    borderColor: HARVEST_COLORS.mist,
  },
  telegramButtonText: {
    color: HARVEST_COLORS.flame,
    fontSize: 15,
    fontWeight: '800',
  },
  telegramButtonTextDisabled: {
    color: HARVEST_COLORS.smoke,
  },
  dividerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: HARVEST_COLORS.mist,
  },
  dividerText: {
    color: HARVEST_COLORS.ash,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  form: {
    gap: 12,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    color: HARVEST_COLORS.ink,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
    paddingHorizontal: 2,
  },
  input: {
    backgroundColor: HARVEST_COLORS.paper,
    borderColor: HARVEST_COLORS.bone,
    borderRadius: 16,
    borderWidth: 1,
    color: HARVEST_COLORS.ink,
    fontSize: 15,
    height: 48,
    paddingHorizontal: 14,
  },
  passwordRow: {
    alignItems: 'center',
    backgroundColor: HARVEST_COLORS.paper,
    borderColor: HARVEST_COLORS.bone,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
  },
  passwordInput: {
    color: HARVEST_COLORS.ink,
    flex: 1,
    fontSize: 15,
    height: 48,
    paddingLeft: 14,
    paddingRight: 8,
  },
  eyeButton: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  eyeText: {
    color: HARVEST_COLORS.flame,
    fontSize: 12,
    fontWeight: '700',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: HARVEST_COLORS.flame,
    borderRadius: 16,
    height: 50,
    justifyContent: 'center',
    marginTop: 18,
    shadowColor: HARVEST_COLORS.flame,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
  },
  primaryButtonPressed: {
    transform: [{ scale: 0.99 }],
  },
  primaryButtonDisabled: {
    backgroundColor: HARVEST_COLORS.mist,
    shadowOpacity: 0,
  },
  primaryButtonText: {
    color: HARVEST_COLORS.paper,
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    height: 42,
    justifyContent: 'center',
    marginTop: 6,
  },
  secondaryButtonText: {
    color: HARVEST_COLORS.stone,
    fontSize: 14,
    fontWeight: '700',
  },
  roleSwitch: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: HARVEST_COLORS.paper,
    borderColor: HARVEST_COLORS.mist,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 14,
    minHeight: 44,
    paddingHorizontal: 18,
  },
  roleSwitchText: {
    color: HARVEST_COLORS.flame,
    fontSize: 14,
    fontWeight: '800',
  },
});
