import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { OrderStatus } from '@/src/modules/orders/types/orders';
import useTheme from '@/src/shared/use-theme/use-theme';

interface OrderFiltersProps {
  selectedStatus?: OrderStatus;
  onStatusChange: (status?: OrderStatus) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({ selectedStatus, onStatusChange }) => {
  const { colors } = useTheme();
  
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
              {
                backgroundColor: selectedStatus === option.value 
                  ? colors.primary500 
                  : colors.grey100
              }
            ]}
            onPress={() => onStatusChange(option.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: selectedStatus === option.value 
                    ? colors.white 
                    : colors.muted
                }
              ]}
            >
              {option.label}
            </Text>
            {option.count > 0 && (
              <View style={[
                styles.countBadge,
                {
                  backgroundColor: selectedStatus === option.value 
                    ? colors.white 
                    : colors.grey100
                }
              ]}>
                <Text style={[
                  styles.countText,
                  {
                    color: selectedStatus === option.value 
                      ? colors.primary500 
                      : colors.muted
                  }
                ]}>{option.count}</Text>
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
    borderRadius: 20,
    gap: 8,
  },
  filterText: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
  },
  countBadge: {
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
  },
});

export default OrderFilters;
