import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import useTheme from '@/src/shared/use-theme/use-theme';
import { BackArrowIcon, EmailIcon, PhoneIcon, TelegramIcon } from '@/src/shared/components/icons';
import { HARVEST_COLORS, HARVEST_SHADOWS } from '@/src/shared/harvest-theme';

const SupportScreen: React.FC = () => {
  const theme = useTheme();

  const handleBack = () => {
    router.back();
  };

  const handleEmailPress = () => {
    const email = 'chisto.doma1@mail.ru';
    const subject = 'Поддержка Mussor';
    const body = 'Здравствуйте! Я обращаюсь в службу поддержки по поводу...';

    const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.canOpenURL(emailUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(emailUrl);
        } else {
          Alert.alert('Ошибка', 'Не удалось открыть почтовое приложение');
        }
      })
      .catch(() => {
        Alert.alert('Ошибка', 'Не удалось открыть почтовое приложение');
      });
  };

  const handlePhonePress = () => {
    const phoneNumber = '8-800-775-63-65';
    const phoneUrl = `tel:${phoneNumber}`;

    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Ошибка', 'Не удалось открыть приложение для звонков');
        }
      })
      .catch(() => {
        Alert.alert('Ошибка', 'Не удалось открыть приложение для звонков');
      });
  };

  const handleTelegramPress = () => {
    const telegramUrl = 'https://t.me/chistodoma1';

    Linking.canOpenURL(telegramUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(telegramUrl);
        } else {
          Alert.alert('Ошибка', 'Не удалось открыть Telegram');
        }
      })
      .catch(() => {
        Alert.alert('Ошибка', 'Не удалось открыть Telegram');
      });
  };

  const supportOptions = [
    {
      icon: <PhoneIcon width={20} height={20} color={String(theme.colors.primary500)} />,
      title: 'Телефон поддержки',
      subtitle: '8-800-775-63-65',
      description: 'Звоните нам с 9:00 до 18:00 по московскому времени',
      onPress: handlePhonePress,
      color: String(theme.colors.primary500),
    },
    {
      icon: <TelegramIcon width={20} height={20} color={String(theme.colors.primary500)} />,
      title: 'Telegram',
      subtitle: '@chistodoma1',
      description: 'Быстрая связь через Telegram',
      onPress: handleTelegramPress,
      color: String(theme.colors.primary500),
    }
  ];

  const faqItems = [
    {
      question: 'Как создать заказ?',
      answer: 'Перейдите в раздел "Заказы" и нажмите кнопку "Создать заказ". Заполните все необходимые поля и подтвердите заказ.'
    },
    {
      question: 'Как отследить статус заказа?',
      answer: 'В разделе "Заказы" вы можете видеть все ваши заказы и их текущий статус. Также мы отправляем уведомления об изменениях статуса.'
    },
    {
      question: 'Как отменить заказ?',
      answer: 'Заказ можно отменить в течение 30 минут после создания. Перейдите в детали заказа и нажмите "Отменить заказ".'
    },
    {
      question: 'Как изменить данные профиля?',
      answer: 'В разделе "Профиль" нажмите "Редактировать профиль" и внесите необходимые изменения.'
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Заголовок */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <BackArrowIcon width={24} height={24} color={HARVEST_COLORS.ink} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.grey900 }]}>Поддержка</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Приветственное сообщение */}
        <View style={[styles.welcomeCard, { backgroundColor: theme.colors.primary500_12 }]}>
          <Text style={[styles.welcomeTitle, { color: theme.colors.grey900 }]}>
            Мы всегда готовы помочь! 🤝
          </Text>
          <Text style={[styles.welcomeText, { color: theme.colors.grey600 }]}>
            Выберите удобный способ связи с нашей службой поддержки
          </Text>
        </View>

        {/* Способы связи */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.grey900 }]}>Способы связи</Text>
          {supportOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.supportOption, { backgroundColor: theme.colors.white }]}
              onPress={option.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.supportOptionContent}>
                <View style={styles.supportIcon}>
                  <View style={styles.supportIconContainer}>{option.icon}</View>
                </View>
                <View style={styles.supportText}>
                  <Text style={[styles.supportTitle, { color: theme.colors.grey900 }]}>
                    {option.title}
                  </Text>
                  <Text style={[styles.supportSubtitle, { color: theme.colors.primary500 }]}>
                    {option.subtitle}
                  </Text>
                  <Text style={[styles.supportDescription, { color: theme.colors.grey600 }]}>
                    {option.description}
                  </Text>
                </View>
              </View>
              <Text style={[styles.arrow, { color: theme.colors.grey400 }]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.grey900 }]}>Часто задаваемые вопросы</Text>
          {faqItems.map((item, index) => (
            <View key={index} style={[styles.faqItem, { backgroundColor: theme.colors.white }]}>
              <Text style={[styles.faqQuestion, { color: theme.colors.grey900 }]}>
                {item.question}
              </Text>
              <Text style={[styles.faqAnswer, { color: theme.colors.grey600 }]}>
                {item.answer}
              </Text>
            </View>
          ))}
        </View> */}

        {/* Дополнительная информация */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.primary500_12 }]}>
          <Text style={[styles.infoTitle, { color: theme.colors.grey900 }]}>
            Время работы службы поддержки
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.grey600 }]}>
            Понедельник - Пятница: 9:00 - 18:00 (МСК){'\n'}
            Суббота: 10:00 - 16:00 (МСК){'\n'}
            Воскресенье: выходной
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: HARVEST_COLORS.mist,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: HARVEST_COLORS.mist,
    ...HARVEST_SHADOWS.card,
  },
  supportOptionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  supportIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportText: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  supportSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  supportDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  arrow: {
    fontSize: 20,
    fontWeight: '300',
  },
  faqItem: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: HARVEST_COLORS.mist,
    ...HARVEST_SHADOWS.card,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 13,
    lineHeight: 18,
  },
  infoCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default SupportScreen;
