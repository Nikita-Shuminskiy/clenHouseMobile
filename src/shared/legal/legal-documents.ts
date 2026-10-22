/**
 * Юридические документы сервиса. Тексты размещены на сайте, приложение
 * ссылается на них — так документы остаются едиными для сайта, бота и приложений.
 */

// Punycode-адрес выносмусора.рф — корректно открывается на iOS и Android
export const SITE_URL = 'https://xn--80ad4adfbofbt7f.xn--p1ai';

/** Редакция документов, с которой соглашается пользователь */
export const LEGAL_REVISION = '22 октября 2026 г.';

export interface LegalDocument {
  key: 'offer' | 'privacyPolicy' | 'consentPersonalData' | 'consentMarketing' | 'termsOfService';
  title: string;
  url: string;
}

export const LEGAL_DOCUMENTS: Record<LegalDocument['key'], LegalDocument> = {
  offer: {
    key: 'offer',
    title: 'Публичная оферта',
    url: `${SITE_URL}/offer`,
  },
  privacyPolicy: {
    key: 'privacyPolicy',
    title: 'Политика конфиденциальности',
    url: `${SITE_URL}/privacy-policy`,
  },
  consentPersonalData: {
    key: 'consentPersonalData',
    title: 'Согласие на обработку персональных данных',
    url: `${SITE_URL}/consent-personal-data`,
  },
  consentMarketing: {
    key: 'consentMarketing',
    title: 'Согласие на рекламную рассылку',
    url: `${SITE_URL}/consent-marketing`,
  },
  termsOfService: {
    key: 'termsOfService',
    title: 'Пользовательское соглашение',
    url: `${SITE_URL}/terms-of-service`,
  },
};

export const LEGAL_DOCUMENTS_LIST: LegalDocument[] = [
  LEGAL_DOCUMENTS.offer,
  LEGAL_DOCUMENTS.privacyPolicy,
  LEGAL_DOCUMENTS.consentPersonalData,
  LEGAL_DOCUMENTS.consentMarketing,
  LEGAL_DOCUMENTS.termsOfService,
];
