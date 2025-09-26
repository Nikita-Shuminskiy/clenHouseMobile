import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { OrderStatus } from '@/src/modules/orders/types/orders';

interface OrderFiltersProps {
  selectedStatus?: OrderStatus;
  onStatusChange: (status?: OrderStatus) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({ selectedStatus, onStatusChange }) => {
  const statusOptions = [
    { value: undefined, label: 'Все', count: 0 },
    { value: OrderStatus.NEW, label: 'Новые', count: 0 },
    { value: OrderStatus.PAID, label: 'Оплаченные', count: 0 },
    { value: OrderStatus.ASSIGNED, label: 'Назначенные', count: 0 },
    { value: OrderStatus.IN_PROGRESS, label: 'В работе', count: 0 },
    { value: OrderStatus.DONE, label: 'Завершенные', count: 0 },
    { value: OrderStatus.CANCELED, label: 'Отмененные', count: 0 },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {statusOptions.map((option) => (
          <TouchableOpacity
            key={option.value || 'all'}
            style={[
              styles.filterButton,
              selectedStatus === option.value && styles.activeFilterButton,
            ]}
            onPress={() => onStatusChange(option.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                selectedStatus === option.value && styles.activeFilterText,
              ]}
            >
              {option.label}
            </Text>
            {option.count > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{option.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F3F3',
    borderRadius: 20,
    gap: 8,
  },
  activeFilterButton: {
    backgroundColor: '#1A1A1A',
  },
  filterText: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#5A6E8A',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  countBadge: {
    backgroundColor: '#EFF3F8',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  countText: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 16,
    color: '#5A6E8A',
  },
});

export default OrderFilters;
