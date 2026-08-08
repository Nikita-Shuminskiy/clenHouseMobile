import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme } from '@/src/shared/use-theme';
import { DocumentIcon } from '@/src/shared/components/icons';

interface EmptyOrdersProps {
  message?: string;
  description?: string;
}

const EmptyOrders: React.FC<EmptyOrdersProps> = ({
  message = 'Заказы не найдены',
  description = 'Попробуйте изменить фильтры или обновить список',
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: colors.surfaceInfo }]}>
        <DocumentIcon width={32} height={32} color={String(colors.grey400)} />
      </View>
      <Text style={[styles.message, { color: colors.textPrimary }]}>{message}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  message: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default EmptyOrders;
