import React, { useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { toast } from 'sonner-native';

import { useLoginByTelegram } from '@/src/modules/auth/hooks/useLoginByTelegram';
import { parseTelegramPayload } from '@/src/modules/auth/utils/telegram-login';
import { HARVEST_COLORS } from '@/src/shared/harvest-theme';

const normalizeParams = (params: Record<string, string | string[]>) =>
  Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ]),
  );

const TelegramAuthCallbackScreen = () => {
  const params = useLocalSearchParams<Record<string, string | string[]>>();
  const loginByTelegram = useLoginByTelegram();
  const handledRef = useRef(false);

  const payload = useMemo(
    () => parseTelegramPayload(normalizeParams(params)),
    [params],
  );

  useEffect(() => {
    if (handledRef.current) {
      return;
    }
    handledRef.current = true;

    if (!payload) {
      toast.error('Ошибка входа', {
        description: 'Telegram вернул некорректные данные',
        duration: 5000,
      });
      router.replace('/(auth)');
      return;
    }

    loginByTelegram.mutate(payload, {
      onError: () => router.replace('/(auth)'),
    });
  }, [loginByTelegram, payload]);

  return (
    <View style={styles.container}>
      <ActivityIndicator color={HARVEST_COLORS.flame} size="large" />
      <Text style={styles.title}>Завершаем вход</Text>
      <Text style={styles.text}>Проверяем Telegram и открываем приложение</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 24,
    backgroundColor: HARVEST_COLORS.canvas,
  },
  title: {
    color: HARVEST_COLORS.ink,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginTop: 10,
    textAlign: 'center',
  },
  text: {
    color: HARVEST_COLORS.stone,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default TelegramAuthCallbackScreen;
