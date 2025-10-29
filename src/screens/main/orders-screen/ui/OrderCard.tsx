import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { OrderResponseDto, OrderStatus } from '@/src/modules/orders/types/orders';
import Button from '@/src/shared/components/ui-kit/button';
import { formatDateStringFull, formatPrice } from '@/src/shared/utils/formatting';

interface OrderCardProps {
  order: OrderResponseDto;
  onPress?: (order: OrderResponseDto) => void;
  onAction?: (order: OrderResponseDto, action: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onPress, onAction }) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.NEW:
        return '#4CAF50';
      case OrderStatus.PAID:
        return '#2196F3';
      case OrderStatus.ASSIGNED:
        return '#FF9800';
      case OrderStatus.IN_PROGRESS:
        return '#9C27B0';
      case OrderStatus.DONE:
        return '#9E9E9E';
      case OrderStatus.CANCELED:
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.NEW:
        return 'Новый';
      case OrderStatus.PAID:
        return 'Оплачен';
      case OrderStatus.ASSIGNED:
        return 'Назначен';
      case OrderStatus.IN_PROGRESS:
        return 'В работе';
      case OrderStatus.DONE:
        return 'Завершен';
      case OrderStatus.CANCELED:
        return 'Отменен';
      default:
        return 'Неизвестно';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(order)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>#{order.id.slice(-8)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
          </View>
        </View>
        <Text style={styles.price}>{formatPrice(Number(order.price))}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description} numberOfLines={2}>
          {order.description}
        </Text>

        <View style={styles.addressContainer}>
          <Text style={styles.addressLabel}>Адрес:</Text>
          <Text style={styles.address}>{order.address}</Text>
        </View>

        <View style={styles.customerContainer}>
          <Text style={styles.customerLabel}>Клиент:</Text>
          <Text style={styles.customerName}>{order.customer.name}</Text>
          <Text style={styles.customerPhone}>{order.customer.phone}</Text>
        </View>

        {order.currier && (
          <View style={styles.courierContainer}>
            <Text style={styles.courierLabel}>Курьер:</Text>
            <Text style={styles.courierName}>{order.currier.name}</Text>
          </View>
        )}

        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Создан:</Text>
          <Text style={styles.date}>{formatDateStringFull(order.createdAt)}</Text>
        </View>

        {order.scheduledAt && (
          <View style={styles.scheduledContainer}>
            <Text style={styles.scheduledLabel}>Запланирован на:</Text>
            <Text style={styles.scheduledDate}>{formatDateStringFull(order.scheduledAt)}</Text>
          </View>
        )}
      </View>

      {order.status === OrderStatus.NEW && onAction && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => onAction(order, 'accept')}
          >
            <Text style={styles.acceptButtonText}>Принять</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => onAction(order, 'cancel')}
          >
            <Text style={styles.cancelButtonText}>Отменить</Text>
          </TouchableOpacity>
        </View>
      )}

      {order.status === OrderStatus.ASSIGNED && onAction && (
        <View style={styles.actions}>
          <Button
            type="primary"
            onPress={() => onAction(order, 'start')}
            style={styles.actionButton}
          >
            <Text style={styles.startButtonText}>Начать</Text>
          </Button>
        </View>
      )}

      {order.status === OrderStatus.IN_PROGRESS && onAction && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => onAction(order, 'complete')}
          >
            <Text style={styles.completeButtonText}>Завершить</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orderId: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    color: '#1A1A1A',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    color: '#FFFFFF',
  },
  price: {
    fontFamily: 'Onest',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 24,
    color: '#1A1A1A',
  },
  content: {
    gap: 8,
  },
  description: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#1A1A1A',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  addressLabel: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    color: '#5A6E8A',
    minWidth: 50,
  },
  address: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: '#1A1A1A',
    flex: 1,
  },
  customerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customerLabel: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    color: '#5A6E8A',
    minWidth: 50,
  },
  customerName: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: '#1A1A1A',
    marginRight: 8,
  },
  customerPhone: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: '#5A6E8A',
  },
  courierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  courierLabel: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    color: '#5A6E8A',
    minWidth: 50,
  },
  courierName: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: '#1A1A1A',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateLabel: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    color: '#5A6E8A',
    minWidth: 50,
  },
  date: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: '#1A1A1A',
  },
  scheduledContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduledLabel: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    color: '#5A6E8A',
    minWidth: 50,
  },
  scheduledDate: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: '#1A1A1A',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  acceptButtonText: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  cancelButtonText: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
  },
  startButton: {
    backgroundColor: 'orange',
  },
  startButtonText: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  completeButtonText: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
  },
});

export default OrderCard;
