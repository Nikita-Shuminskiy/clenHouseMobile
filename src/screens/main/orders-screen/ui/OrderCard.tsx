import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { OrderResponseDto, OrderStatus } from '@/src/modules/orders/types/orders';
import Button from '@/src/shared/components/ui-kit/button';
import { formatPrice, formatDateString } from '@/src/shared/utils/formatting';
import { useLocation } from '@/src/shared/hooks/useLocation';
import { calculateDistance, formatDistance } from '@/src/shared/utils/distance';
import useTheme from '@/src/shared/use-theme/use-theme';

interface OrderCardProps {
  order: OrderResponseDto;
  onPress?: (order: OrderResponseDto) => void;
  onAction?: (order: OrderResponseDto, action: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onPress, onAction }) => {


  const { location, hasPermission } = useLocation();
  const hasLocation = hasPermission && location !== null;
  const { colors } = useTheme();

  // Вычисляем расстояние до заказа, если есть координаты пользователя и заказа
  const distance = useMemo(() => {
    if (!hasLocation || !location || !order.coordinates) {
      return null;
    }

    return calculateDistance(
      {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      {
        latitude: order.coordinates.lat,
        longitude: order.coordinates.lon,
      }
    );
  }, [hasLocation, location, order.coordinates]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.NEW:
        return '#4CAF50';
      case OrderStatus.PAID:
        return '#2196F3';
      case OrderStatus.ASSIGNED:
        return '#FF9800';
      case OrderStatus.IN_PROGRESS:
        return '#FFC107';
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

  const handlePhonePress = (phone: string, event: any) => {
    event.stopPropagation();
    const phoneNumber = phone.replace(/[\s()\-]/g, '');
    const phoneUrl = `tel:${phoneNumber}`;

    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Ошибка', 'Не удалось открыть приложение для звонков');
        }
      })
      .catch(() => {
        Alert.alert('Ошибка', 'Не удалось открыть приложение для звонков');
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

        {distance !== null && (
          <View style={styles.distanceContainer}>
            <Text style={styles.distanceLabel}>Расстояние:</Text>
            <Text style={styles.distance}>{formatDistance(distance)}</Text>
          </View>
        )}

        {order.numberPackages !== undefined && order.numberPackages > 0 && (
          <View style={styles.packagesContainer}>
            <Text style={styles.packagesIcon}>📦</Text>
            <Text style={styles.packagesText}>
              {order.numberPackages} {order.numberPackages === 1 ? 'пакет' : order.numberPackages < 5 ? 'пакета' : 'пакетов'}
            </Text>
          </View>
        )}

        <View style={styles.customerContainer}>
          <Text style={styles.customerLabel}>Клиент:</Text>
          <Text style={styles.customerName}>{order.customer.name}</Text>
          <TouchableOpacity
            onPress={(e) => handlePhonePress(order.customer.phone, e)}
            activeOpacity={0.7}
          >
            <Text style={styles.customerPhone}>{order.customer.phone}</Text>
          </TouchableOpacity>
        </View>

        {order.currier && (
          <View style={styles.courierContainer}>
            <Text style={styles.courierLabel}>Курьер:</Text>
            <Text style={styles.courierName}>{order.currier.name}</Text>
          </View>
        )}

        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Создан:</Text>
          <Text style={styles.date}>{formatDateString(order.createdAt)}</Text>
        </View>

        {order.scheduledAt && (
          <View style={styles.scheduledContainer}>
            <Text style={styles.scheduledLabel}>Запланирован на:</Text>
            <Text style={styles.scheduledDate}>{formatDateString(order.scheduledAt)}</Text>
          </View>
        )}
      </View>

      {order.status === OrderStatus.NEW && onAction && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary500 }]}
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

      {order.status === OrderStatus.PAID && onAction && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.blue }]}
            onPress={() => onAction(order, 'accept')}
          >
            <Text style={styles.acceptButtonText}>Принять</Text>
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
          <Button
            type="primary"
            onPress={() => onAction(order, 'complete')}
            style={styles.actionButton}
          >
            <Text style={styles.startButtonText}>Завершить</Text>
          </Button>
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
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distanceLabel: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    color: '#5A6E8A',
    minWidth: 50,
  },
  distance: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 16,
    color: '#2196F3',
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
  packagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  packagesIcon: {
    fontSize: 16,
  },
  packagesText: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 12,
    color: '#1A1A1A',
    lineHeight: 16,
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
  startButtonText: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
  },
});

export default OrderCard;
