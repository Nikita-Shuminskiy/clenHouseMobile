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

type LoginMode = 'customer' | 'courier';

export const AuthScreen = () => {
  const [mode, setMode] = useState<LoginMode>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const loginByEmail = useLoginByEmail();

  const isCourier = mode === 'courier';
  const isDisabled =
    loginByEmail.isPending || email.trim().length === 0 || password.length === 0;

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
                  placeholderTextColor="#A4A8AE"
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
                    placeholderTextColor="#A4A8AE"
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
    </SafeAreaView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F3',
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
    backgroundColor: '#FFFFFF',
    borderColor: '#F0E3D8',
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 82,
    paddingHorizontal: 18,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 22,
  },
  brandIconWrap: {
    alignItems: 'center',
    backgroundColor: '#FFF0E5',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  brandIcon: {
    color: '#E85F23',
    fontSize: 24,
    fontWeight: '800',
  },
  brandTitle: {
    color: '#272624',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
  },
  brandSubtitle: {
    color: '#7D776F',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 18,
    shadowColor: '#27140A',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  heading: {
    alignItems: 'center',
    marginBottom: 22,
  },
  eyebrow: {
    color: '#FF5A0A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  title: {
    color: '#2E2F33',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    marginTop: 6,
    textAlign: 'center',
  },
  subtitle: {
    color: '#7D828A',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    maxWidth: 270,
    textAlign: 'center',
  },
  form: {
    gap: 12,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    color: '#383A3F',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
    paddingHorizontal: 2,
  },
  input: {
    backgroundColor: '#F4F5F7',
    borderColor: '#ECEEF1',
    borderRadius: 14,
    borderWidth: 1,
    color: '#25272B',
    fontSize: 15,
    height: 48,
    paddingHorizontal: 14,
  },
  passwordRow: {
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
    borderColor: '#ECEEF1',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
  },
  passwordInput: {
    color: '#25272B',
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
    color: '#FF5A0A',
    fontSize: 12,
    fontWeight: '700',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#FF5A0A',
    borderRadius: 16,
    height: 50,
    justifyContent: 'center',
    marginTop: 18,
    shadowColor: '#FF5A0A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
  },
  primaryButtonPressed: {
    transform: [{ scale: 0.99 }],
  },
  primaryButtonDisabled: {
    backgroundColor: '#D7D9DE',
    shadowOpacity: 0,
  },
  primaryButtonText: {
    color: '#FFFFFF',
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
    color: '#555A63',
    fontSize: 14,
    fontWeight: '700',
  },
  roleSwitch: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#F0E4DC',
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 14,
    minHeight: 44,
    paddingHorizontal: 18,
  },
  roleSwitchText: {
    color: '#FF5A0A',
    fontSize: 14,
    fontWeight: '800',
  },
});
