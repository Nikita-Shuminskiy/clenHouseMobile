import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 24,
    color: '#1A1A1A',
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
    color: '#1A1A1A',
    marginBottom: 2,
  },
  verificationValue: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#5A6E8A',
  },
  verificationStatus: {
    marginLeft: 12,
  },
  verifiedBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  verifiedText: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 16,
    color: '#FFFFFF',
  },
  verifyButton: {
    backgroundColor: '#EFF3F8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  verifyText: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    color: '#5A6E8A',
  },
});

export default VerificationStatus;
