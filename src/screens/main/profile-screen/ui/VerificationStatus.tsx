import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HARVEST_COLORS, HARVEST_SHADOWS } from '@/src/shared/harvest-theme';

interface VerificationStatusProps {
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  phone?: string;
  email?: string;
  onVerifyPhone?: () => void;
  onVerifyEmail?: () => void;
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({
  isPhoneVerified = false,
  isEmailVerified = false,
  phone,
  email,
  onVerifyPhone,
  onVerifyEmail
}) => {
  const verificationItems = [
    {
      type: 'phone',
      label: 'Телефон',
      value: phone,
      isVerified: isPhoneVerified,
      onPress: onVerifyPhone,
      icon: '📱'
    },
    {
      type: 'email',
      label: 'Email',
      value: email,
      isVerified: isEmailVerified,
      onPress: onVerifyEmail,
      icon: '📧'
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Верификация</Text>
      <View style={styles.verificationList}>
        {verificationItems.map((item, index) => (
          <View key={index} style={styles.verificationItem}>
            <View style={styles.verificationContent}>
              <Text style={styles.verificationIcon}>{item.icon}</Text>
              <View style={styles.verificationText}>
                <Text style={styles.verificationLabel}>{item.label}</Text>
                <Text style={styles.verificationValue}>{item.value || 'Не указан'}</Text>
              </View>
            </View>
            <View style={styles.verificationStatus}>
              {item.isVerified ? (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.verifyButton}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <Text style={styles.verifyText}>Подтвердить</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: HARVEST_COLORS.paper,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: HARVEST_COLORS.mist,
    ...HARVEST_SHADOWS.card,
  },
  title: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 24,
    color: HARVEST_COLORS.ink,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  verificationList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  verificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  verificationIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  verificationText: {
    flex: 1,
  },
  verificationLabel: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: HARVEST_COLORS.ink,
    marginBottom: 2,
  },
  verificationValue: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: HARVEST_COLORS.stone,
  },
  verificationStatus: {
    marginLeft: 12,
  },
  verifiedBadge: {
    backgroundColor: HARVEST_COLORS.flame,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  verifiedText: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 16,
    color: HARVEST_COLORS.paper,
  },
  verifyButton: {
    backgroundColor: HARVEST_COLORS.softCream,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  verifyText: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    color: HARVEST_COLORS.stone,
  },
});

export default VerificationStatus;
