import React from 'react';
import { Linking, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import type { VerifyTelegramRequest } from '@/src/modules/auth/types';
import {
  TELEGRAM_BOT_NAME,
  TELEGRAM_WIDGET_ORIGIN,
} from '@/src/modules/auth/constants/telegram';
import { HARVEST_COLORS, HARVEST_SHADOWS } from '@/src/shared/harvest-theme';

type TelegramLoginModalProps = {
  visible: boolean;
  isLoading: boolean;
  onClose: () => void;
  onAuth: (payload: VerifyTelegramRequest) => void;
};

export const TelegramLoginModal = ({
  visible,
  isLoading,
  onClose,
}: TelegramLoginModalProps) => {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Telegram</Text>
          <Text style={styles.title}>Вход через Telegram</Text>
          <Text style={styles.text}>
            В web-режиме откройте сайт, там уже подключен Telegram Login Widget
            для @{TELEGRAM_BOT_NAME}.
          </Text>
          <Pressable
            accessibilityRole="button"
            disabled={isLoading}
            onPress={() => Linking.openURL(TELEGRAM_WIDGET_ORIGIN)}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryText}>Открыть сайт</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryText}>Закрыть</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    backgroundColor: 'rgba(29,30,28,0.34)',
  },
  card: {
    width: '100%',
    maxWidth: 360,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: HARVEST_COLORS.mist,
    backgroundColor: HARVEST_COLORS.paper,
    ...HARVEST_SHADOWS.card,
  },
  eyebrow: {
    color: HARVEST_COLORS.flame,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  title: {
    color: HARVEST_COLORS.ink,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginTop: 6,
    textAlign: 'center',
  },
  text: {
    color: HARVEST_COLORS.stone,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginTop: 18,
    borderRadius: 16,
    backgroundColor: HARVEST_COLORS.flame,
  },
  primaryText: {
    color: HARVEST_COLORS.paper,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
    marginTop: 6,
  },
  secondaryText: {
    color: HARVEST_COLORS.stone,
    fontSize: 14,
    fontWeight: '800',
  },
});
