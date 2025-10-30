import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import useTheme from '@/src/shared/use-theme/use-theme';
import { BackArrowIcon, EmailIcon, PhoneIcon, AddressIcon } from '@/src/shared/components/icons';

const PrivacyScreen: React.FC = () => {
  const theme = useTheme();

  const handleBack = () => {
    router.back();
  };

  const privacySections = [
    {
      title: '1. Сбор информации',
      content: 'Мы собираем только необходимую информацию для предоставления наших услуг:\n\n• Имя и контактные данные\n• Информация о заказах\n• Данные для доставки\n• История взаимодействий с приложением'
    },
    {
      title: '2. Использование данных',
      content: 'Ваши данные используются для:\n\n• Обработки и выполнения заказов\n• Связи с вами по вопросам заказов\n• Улучшения качества сервиса\n• Предоставления технической поддержки\n• Соблюдения правовых требований'
    },
    {
      title: '3. Защита данных',
      content: 'Мы применяем современные методы защиты:\n\n• Шифрование данных при передаче\n• Безопасное хранение информации\n• Ограниченный доступ к данным\n• Регулярные проверки безопасности\n• Соответствие стандартам защиты'
    },
    {
      title: '4. Передача данных третьим лицам',
      content: 'Мы не продаем ваши данные. Передача возможна только:\n\n• Службам доставки для выполнения заказов\n• Платежным системам для обработки платежей\n• При требовании государственных органов\n• При вашем явном согласии'
    },
    {
      title: '5. Ваши права',
      content: 'Вы имеете право:\n\n• Получить копию ваших данных\n• Исправить неточную информацию\n• Удалить ваши данные\n• Ограничить обработку данных\n• Отозвать согласие на обработку\n• Подать жалобу в надзорные органы'
    },
    {
      title: '6. Cookies и аналитика',
      content: 'Мы используем:\n\n• Технические cookies для работы приложения\n• Аналитические данные для улучшения сервиса\n• Данные о производительности приложения\n• Информацию об ошибках для их исправления'
    },
    {
      title: '7. Хранение данных',
      content: 'Данные хранятся:\n\n• В течение срока действия договора\n• 3 года после последней активности\n• До отзыва согласия на обработку\n• В соответствии с требованиями законодательства'
    },
    {
      title: '8. Изменения в политике',
      content: 'Мы можем обновлять данную политику:\n\n• При изменении законодательства\n• При улучшении сервиса\n• При добавлении новых функций\n• Уведомляем о значимых изменениях\n• Публикуем обновленную версию'
    }
  ];

  const contactInfo = {
    email: 'Chisto.doma1@mail.ru',
    phone: '+7 (921) 965-8884',
    address: '188689, Ленинградская область, Всеволожский район, гп Янино-1, ул Шоссейная, д. 48Е, стр. 6'
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Заголовок */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <BackArrowIcon width={24} height={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.grey900 }]}>Конфиденциальность</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Приветственное сообщение */}
        <View style={[styles.welcomeCard, { backgroundColor: theme.colors.primary500_12 }]}>
          <Text style={[styles.welcomeTitle, { color: theme.colors.grey900 }]}>
            Защита ваших данных 🛡️
          </Text>
          <Text style={[styles.welcomeText, { color: theme.colors.grey600 }]}>
            Мы серьезно относимся к защите вашей конфиденциальности и персональных данных
          </Text>
        </View>

        {/* Основная информация */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.infoTitle, { color: theme.colors.grey900 }]}>
            Политика конфиденциальности
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.grey600 }]}>
            Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
          </Text>
          <Text style={[styles.infoDescription, { color: theme.colors.grey600 }]}>
            Данная политика описывает, как мы собираем, используем и защищаем вашу персональную информацию при использовании приложения Mussor.
          </Text>
        </View>

        {/* Разделы политики */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.grey900 }]}>Основные положения</Text>
          {privacySections.map((section, index) => (
            <View key={index} style={[styles.privacySection, { backgroundColor: theme.colors.white }]}>
              <Text style={[styles.sectionTitleText, { color: theme.colors.grey900 }]}>
                {section.title}
              </Text>
              <Text style={[styles.sectionContent, { color: theme.colors.grey600 }]}>
                {section.content}
              </Text>
            </View>
          ))}
        </View>

        {/* Контактная информация */}
        <View style={[styles.contactCard, { backgroundColor: theme.colors.primary500_12 }]}>
          <Text style={[styles.contactTitle, { color: theme.colors.grey900 }]}>
            Вопросы по конфиденциальности
          </Text>
          <Text style={[styles.contactText, { color: theme.colors.grey600 }]}>
            Если у вас есть вопросы по обработке персональных данных, обращайтесь:
          </Text>
          
          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <EmailIcon width={20} height={20} color={theme.colors.primary500} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactLabel, { color: theme.colors.grey600 }]}>Email</Text>
              <Text style={[styles.contactValue, { color: theme.colors.grey900 }]}>
                {contactInfo.email}
              </Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <PhoneIcon width={20} height={20} color={theme.colors.primary500} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactLabel, { color: theme.colors.grey600 }]}>Телефон</Text>
              <Text style={[styles.contactValue, { color: theme.colors.grey900 }]}>
                {contactInfo.phone}
              </Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <AddressIcon width={20} height={20} color={theme.colors.primary500} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactLabel, { color: theme.colors.grey600 }]}>Адрес</Text>
              <Text style={[styles.contactValue, { color: theme.colors.grey900 }]}>
                {contactInfo.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Дополнительная информация */}
        <View style={[styles.footerCard, { backgroundColor: theme.colors.grey100 }]}>
          <Text style={[styles.footerTitle, { color: theme.colors.grey900 }]}>
            Согласие на обработку данных
          </Text>
          <Text style={[styles.footerText, { color: theme.colors.grey600 }]}>
            Используя наше приложение, вы соглашаетесь с данной политикой конфиденциальности. 
            Мы обязуемся защищать ваши данные в соответствии с действующим законодательством РФ.
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
    borderBottomColor: '#F0F0F0',
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
    borderRadius: 12,
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
  infoCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#8E8E8E',
    marginBottom: 12,
  },
  infoDescription: {
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
  privacySection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitleText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2C2C2C',
  },
  sectionContent: {
    fontSize: 13,
    lineHeight: 18,
  },
  contactCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactIcon: {
    marginRight: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default PrivacyScreen;
