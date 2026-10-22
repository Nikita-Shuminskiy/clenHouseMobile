import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

import CheckBox from '@/src/shared/components/ui-kit/check-box';
import { HARVEST_COLORS } from '@/src/shared/harvest-theme';
import { LEGAL_DOCUMENTS } from '@/src/shared/legal/legal-documents';

/**
 * Согласия, которые пользователь даёт до передачи персональных данных.
 * Чек-боксы разделены и заранее не отмечены, ссылка на Политику —
 * внутри согласия на обработку персональных данных.
 */
export interface LegalConsentsState {
  terms: boolean;
  personalData: boolean;
  marketing: boolean;
}

export const EMPTY_LEGAL_CONSENTS: LegalConsentsState = {
  terms: false,
  personalData: false,
  marketing: false,
};

export const hasRequiredConsents = (consents: LegalConsentsState): boolean =>
  consents.terms && consents.personalData;

const openDocument = (url: string) => {
  Linking.openURL(url).catch(() => {
    // ссылку не удалось открыть — пользователь увидит документы на сайте
  });
};

interface ConsentRowProps {
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const ConsentRow: React.FC<ConsentRowProps> = ({ checked, onToggle, children }) => (
  <View style={styles.row}>
    <CheckBox isActive={checked} onClick={onToggle} />
    <Text style={styles.text}>{children}</Text>
  </View>
);

interface LegalConsentsProps {
  value: LegalConsentsState;
  onChange: (next: LegalConsentsState) => void;
  /** order — только акцепт оферты (согласия уже даны при регистрации) */
  variant?: 'full' | 'order';
}

export const LegalConsents: React.FC<LegalConsentsProps> = ({
  value,
  onChange,
  variant = 'full',
}) => (
  <View style={styles.container}>
    <ConsentRow
      checked={value.terms}
      onToggle={() => onChange({ ...value, terms: !value.terms })}
    >
      <Text>Я принимаю условия </Text>
      <Text style={styles.link} onPress={() => openDocument(LEGAL_DOCUMENTS.offer.url)}>
        Оферты
      </Text>
      <Text> и </Text>
      <Text
        style={styles.link}
        onPress={() => openDocument(LEGAL_DOCUMENTS.termsOfService.url)}
      >
        Пользовательского соглашения
      </Text>
    </ConsentRow>

    {variant === 'full' && (
      <>
        <ConsentRow
          checked={value.personalData}
          onToggle={() => onChange({ ...value, personalData: !value.personalData })}
        >
          <Text>Я даю </Text>
          <Text
            style={styles.link}
            onPress={() => openDocument(LEGAL_DOCUMENTS.consentPersonalData.url)}
          >
            Согласие на обработку своих персональных данных
          </Text>
          <Text> в соответствии с </Text>
          <Text
            style={styles.link}
            onPress={() => openDocument(LEGAL_DOCUMENTS.privacyPolicy.url)}
          >
            Политикой конфиденциальности
          </Text>
        </ConsentRow>

        <ConsentRow
          checked={value.marketing}
          onToggle={() => onChange({ ...value, marketing: !value.marketing })}
        >
          <Text>Я даю </Text>
          <Text
            style={styles.link}
            onPress={() => openDocument(LEGAL_DOCUMENTS.consentMarketing.url)}
          >
            Согласие на рекламную рассылку
          </Text>
          <Text style={styles.optional}> (необязательно)</Text>
        </ConsentRow>
      </>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 12,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  text: {
    flex: 1,
    fontFamily: 'Onest',
    fontSize: 12,
    lineHeight: 16,
    color: HARVEST_COLORS.driftwood,
  },
  link: {
    color: HARVEST_COLORS.flame,
    textDecorationLine: 'underline',
  },
  optional: {
    color: HARVEST_COLORS.bone,
  },
});

export default LegalConsents;
