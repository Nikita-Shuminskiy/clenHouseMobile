import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface EmptyOrdersProps {
  message?: string;
  description?: string;
}

const EmptyOrders: React.FC<EmptyOrdersProps> = ({ 
  message = 'Заказы не найдены',
  description = 'Попробуйте изменить фильтры или обновить список'
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📋</Text>
      </View>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.description}>{description}</Text>
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
    backgroundColor: '#EFF3F8',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 32,
  },
  message: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 24,
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#5A6E8A',
    textAlign: 'center',
  },
});

export default EmptyOrders;
