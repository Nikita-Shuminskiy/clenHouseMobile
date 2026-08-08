import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import { toast } from 'sonner-native';

import type { VerifyTelegramRequest } from '@/src/modules/auth/types';
import {
  TELEGRAM_BOT_NAME,
  TELEGRAM_MOBILE_DEEP_LINK,
  TELEGRAM_MOBILE_RELAY_URL,
  TELEGRAM_WIDGET_ORIGIN,
} from '@/src/modules/auth/constants/telegram';
import {
  parseTelegramPayload,
  parseTelegramPayloadFromUrl,
} from '@/src/modules/auth/utils/telegram-login';
import { HARVEST_COLORS, HARVEST_SHADOWS } from '@/src/shared/harvest-theme';

type TelegramLoginModalProps = {
  visible: boolean;
  isLoading: boolean;
  onClose: () => void;
  onAuth: (payload: VerifyTelegramRequest) => void;
};

const escapeHtmlAttribute = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const createTelegramWidgetHtml = () => {
  const botName = escapeHtmlAttribute(TELEGRAM_BOT_NAME);
  const authUrl = escapeHtmlAttribute(TELEGRAM_MOBILE_RELAY_URL);

  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <style>
    html, body {
      margin: 0;
      min-height: 100%;
      background: #fff8f1;
      color: #1d1e1c;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 22px;
      box-sizing: border-box;
    }
    .card {
      width: 100%;
      max-width: 360px;
      min-height: 220px;
      border: 1px solid #d9d9d9;
      border-radius: 20px;
      background: #ffffff;
      box-shadow: 0 16px 32px rgba(80, 49, 18, 0.12);
      padding: 24px 18px;
      box-sizing: border-box;
      text-align: center;
    }
    h1 {
      margin: 0 0 8px;
      font-size: 22px;
      line-height: 28px;
      font-weight: 800;
    }
    p {
      margin: 0 auto 22px;
      max-width: 280px;
      color: #615f5c;
      font-size: 14px;
      line-height: 20px;
    }
    .widget {
      display: flex;
      min-height: 48px;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  <main class="card">
    <h1>Вход через Telegram</h1>
    <p>Подтвердите вход в Telegram, и приложение авторизует вас автоматически.</p>
    <div class="widget">
      <script>
        window.onTelegramAuth = function(user) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'telegram-auth',
            payload: user
          }));
        };
        window.addEventListener('error', function(event) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'telegram-error',
            message: event.message || 'Telegram widget load error'
          }));
        });
      </script>
      <script
        async
        src="https://telegram.org/js/telegram-widget.js?22"
        data-telegram-login="${botName}"
        data-size="large"
        data-radius="16"
        data-lang="ru"
        data-userpic="false"
        data-request-access="write"
        data-auth-url="${authUrl}"
        data-onauth="onTelegramAuth(user)">
      </script>
    </div>
  </main>
</body>
</html>`;
};

export const TelegramLoginModal = ({
  visible,
  isLoading,
  onClose,
  onAuth,
}: TelegramLoginModalProps) => {
  const [hasWebViewError, setHasWebViewError] = useState(false);
  const html = useMemo(createTelegramWidgetHtml, []);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data) as {
        type?: string;
        payload?: unknown;
        message?: string;
      };

      if (message.type === 'telegram-error') {
        setHasWebViewError(true);
        return;
      }

      if (message.type !== 'telegram-auth') {
        return;
      }

      const payload = parseTelegramPayload(message.payload);
      if (!payload) {
        toast.error('Ошибка входа', {
          description: 'Telegram вернул некорректные данные',
          duration: 5000,
        });
        return;
      }

      onAuth(payload);
    } catch {
      toast.error('Ошибка входа', {
        description: 'Не удалось прочитать ответ Telegram',
        duration: 5000,
      });
    }
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>Telegram</Text>
              <Text style={styles.title}>Подтвердите вход</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Закрыть</Text>
            </Pressable>
          </View>

          <View style={styles.webViewWrap}>
            {hasWebViewError ? (
              <View style={styles.errorState}>
                <Text style={styles.errorTitle}>Telegram не загрузился</Text>
                <Text style={styles.errorText}>
                  Проверьте интернет и попробуйте открыть вход еще раз.
                </Text>
              </View>
            ) : (
              <WebView
                source={{ html, baseUrl: TELEGRAM_WIDGET_ORIGIN }}
                javaScriptEnabled
                domStorageEnabled
                thirdPartyCookiesEnabled
                setSupportMultipleWindows={false}
                originWhitelist={['*']}
                onError={() => setHasWebViewError(true)}
                onHttpError={() => setHasWebViewError(true)}
                onMessage={handleMessage}
                onShouldStartLoadWithRequest={(request) => {
                  if (request.url.startsWith(TELEGRAM_MOBILE_RELAY_URL)) {
                    const payload = parseTelegramPayloadFromUrl(request.url);
                    if (payload) {
                      onAuth(payload);
                    } else {
                      toast.error('Ошибка входа', {
                        description: 'Telegram вернул некорректные данные',
                        duration: 5000,
                      });
                    }
                    return false;
                  }

                  if (request.url.startsWith(TELEGRAM_MOBILE_DEEP_LINK)) {
                    Linking.openURL(request.url).catch(() => undefined);
                    return false;
                  }

                  if (
                    request.url.startsWith('tg://') ||
                    request.url.startsWith('telegram://')
                  ) {
                    Linking.openURL(request.url).catch(() => undefined);
                    return false;
                  }

                  return true;
                }}
                style={styles.webView}
              />
            )}
            {isLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator color={HARVEST_COLORS.flame} />
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(29,30,28,0.34)',
  },
  sheet: {
    minHeight: 460,
    maxHeight: '88%',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: HARVEST_COLORS.canvas,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  eyebrow: {
    color: HARVEST_COLORS.flame,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  title: {
    color: HARVEST_COLORS.ink,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginTop: 3,
  },
  closeButton: {
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: HARVEST_COLORS.mist,
    backgroundColor: HARVEST_COLORS.paper,
  },
  closeText: {
    color: HARVEST_COLORS.stone,
    fontSize: 13,
    fontWeight: '800',
  },
  webViewWrap: {
    flex: 1,
    minHeight: 360,
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: HARVEST_COLORS.mist,
    backgroundColor: HARVEST_COLORS.paper,
    ...HARVEST_SHADOWS.card,
  },
  webView: {
    flex: 1,
    backgroundColor: HARVEST_COLORS.canvas,
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: HARVEST_COLORS.paper,
  },
  errorTitle: {
    color: HARVEST_COLORS.ink,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    textAlign: 'center',
  },
  errorText: {
    color: HARVEST_COLORS.stone,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,248,241,0.72)',
  },
});
