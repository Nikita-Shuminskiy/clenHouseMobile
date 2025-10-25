import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";

import { useGetMe } from "@/src/modules/auth/hooks/useGetMe";
import { useOrder, useUpdateOrderStatus, useCancelOrder } from "@/src/modules/orders/hooks/useOrders";
import { OrderStatus, OrderResponseDto } from "@/src/modules/orders/types/orders";
import Button from "@/src/shared/components/ui-kit/button";

// Вспомогательные функции для определения доступных действий
const getAvailableActions = (order: OrderResponseDto, userId?: string) => {
  const actions = [];
  
  // Проверяем, является ли пользователь курьером для этого заказа
  const isAssignedCourier = order.currier?.id === userId;
  
  switch (order.status) {
    case OrderStatus.NEW:
      actions.push({ key: 'accept', label: 'Принять заказ', type: 'primary' });
      break;
    case OrderStatus.ASSIGNED:
      if (isAssignedCourier) {
        actions.push({ key: 'start', label: 'Начать выполнение', type: 'primary' });
      }
      break;
    case OrderStatus.IN_PROGRESS:
      if (isAssignedCourier) {
        actions.push({ key: 'complete', label: 'Завершить заказ', type: 'primary' });
      }
      break;
  }
  
  // Кнопка отмены доступна для всех статусов кроме завершенных
  if (order.status !== OrderStatus.DONE && order.status !== OrderStatus.CANCELED) {
    actions.push({ key: 'cancel', label: 'Отменить', type: 'secondary' });
  }
  
  return actions;
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
      return '#4CAF50';
    case OrderStatus.CANCELED:
      return '#F44336';
    default:
      return '#9E9E9E';
  }
};

const OrderDetailsScreen: React.FC = () => {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { data: user } = useGetMe();

  // Получаем конкретный заказ по ID
  const { 
    data: order, 
    isLoading
  } = useOrder(orderId || '');
  const updateStatusMutation = useUpdateOrderStatus();
  const cancelOrderMutation = useCancelOrder();

  // Зарезервировано для будущих действий с заказом (принять, начать, завершить, отменить)
  const handleOrderAction = useCallback((action: string) => {
    if (!order) return;
    
    switch (action) {
      case 'accept':
        updateStatusMutation.mutate({
          id: order.id,
          data: { 
            status: OrderStatus.ASSIGNED,
            currierId: user?.id 
          }
        });
        break;
      case 'start':
        updateStatusMutation.mutate({
          id: order.id,
          data: { 
            status: OrderStatus.IN_PROGRESS,
            currierId: user?.id 
          }
        });
        break;
      case 'complete':
        updateStatusMutation.mutate({
          id: order.id,
          data: { 
            status: OrderStatus.DONE,
            currierId: user?.id 
          }
        });
        break;
      case 'cancel':
        Alert.alert(
          'Отменить заказ',
          'Вы уверены, что хотите отменить этот заказ?',
          [
            { text: 'Нет', style: 'cancel' },
            { 
              text: 'Да', 
              style: 'destructive',
              onPress: () => {
                cancelOrderMutation.mutate({
                  id: order.id,
                  cancelOrderDto: {
                    courierId: user?.id || '',
                    reason: 'Отменен пользователем'
                  }
                });
              }
            }
          ]
        );
        break;
    }
  }, [order, user?.id, updateStatusMutation, cancelOrderMutation]);

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  const handleOpenAddressInMaps = useCallback(async (address: string) => {
    try {
      // Кодируем адрес для URL
      const encodedAddress = encodeURIComponent(address);
      
      // Пробуем открыть в Яндекс Картах
      const yandexMapsUrl = `yandexmaps://maps.yandex.ru/?text=${encodedAddress}`;
      const canOpenYandex = await Linking.canOpenURL(yandexMapsUrl);
      
      if (canOpenYandex) {
        await Linking.openURL(yandexMapsUrl);
      } else {
        // Если Яндекс Карты не установлены, открываем в веб-браузере
        const webUrl = `https://yandex.ru/maps/?text=${encodedAddress}`;
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.error('Ошибка при открытии карт:', error);
      Alert.alert('Ошибка', 'Не удалось открыть карты');
    }
  }, []);

  if (!orderId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Назад</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>ID заказа не указан</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Загрузка...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Назад</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Заказ не найден</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Назад</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>
            Детали заказа #{order.createdAt.split('T')[0]}
          </Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.orderDetails}>
          <Text style={styles.sectionTitle}>Описание</Text>
          <Text style={styles.orderDescription}>{order.description}</Text>
          
          <Text style={styles.sectionTitle}>Адрес</Text>
          <TouchableOpacity 
            onPress={() => handleOpenAddressInMaps(order.address)}
            style={styles.addressContainer}
            activeOpacity={0.7}
          >
            <Text style={styles.orderAddress}>{order.address}</Text>
            <Text style={styles.mapHint}>Нажмите, чтобы открыть в картах</Text>
          </TouchableOpacity>
          
          <Text style={styles.sectionTitle}>Клиент</Text>
          <Text style={styles.customerName}>{order.customer.name}</Text>
          <Text style={styles.customerPhone}>{order.customer.phone}</Text>
          
          <Text style={styles.sectionTitle}>Сумма</Text>
          <Text style={styles.orderAmount}>{order.price} ₽</Text>
          
          {order.notes && (
            <>
              <Text style={styles.sectionTitle}>Заметки</Text>
              <Text style={styles.orderNotes}>{order.notes}</Text>
            </>
          )}
          
          <Text style={styles.sectionTitle}>Запланировано на</Text>
          <Text style={styles.scheduledAt}>
            {new Date(order.scheduledAt).toLocaleString('ru-RU')}
          </Text>
        </View>

        {/* Кнопки действий с заказом */}
        {(() => {
          const availableActions = getAvailableActions(order, user?.id);
          if (availableActions.length === 0) return null;

          return (
            <View style={styles.actionsContainer}>
              <Text style={styles.actionsTitle}>Действия с заказом</Text>
              <View style={styles.actionsButtons}>
                {availableActions.map((action) => (
                  <Button
                    key={action.key}
                    type={action.type as 'primary' | 'secondary'}
                    onPress={() => handleOrderAction(action.key)}
                    disabled={updateStatusMutation.isPending || cancelOrderMutation.isPending}
                    isLoading={
                      (action.key === 'cancel' ? cancelOrderMutation.isPending : updateStatusMutation.isPending) &&
                      (action.key === 'cancel' ? cancelOrderMutation.variables?.id === order.id : updateStatusMutation.variables?.id === order.id)
                    }
                    style={styles.actionButton}
                  >
                    {action.label}
                  </Button>
                ))}
              </View>
            </View>
          );
        })()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFCFE",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 50,
    elevation: 6,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 16,
    color: "#5A6E8A",
  },
  userInfo: {
    // flex: 1,
  },
  greeting: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 24,
    lineHeight: 32,
    color: "#1A1A1A",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#5A6E8A",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  orderDetails: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 16,
    color: "#1A1A1A",
    marginTop: 16,
    marginBottom: 8,
  },
  orderDescription: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 14,
    color: "#5A6E8A",
    lineHeight: 20,
  },
  addressContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E1E5E9",
    marginTop: 4,
  },
  orderAddress: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 14,
    color: "#1A1A1A",
    lineHeight: 20,
    marginBottom: 4,
  },
  mapHint: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 12,
    color: "#5A6E8A",
    fontStyle: "italic",
  },
  customerName: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 14,
    color: "#1A1A1A",
    lineHeight: 20,
  },
  customerPhone: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 14,
    color: "#5A6E8A",
    lineHeight: 20,
  },
  orderAmount: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 18,
    color: "#1A1A1A",
    lineHeight: 24,
  },
  orderNotes: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 14,
    color: "#5A6E8A",
    lineHeight: 20,
    fontStyle: "italic",
  },
  scheduledAt: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 14,
    color: "#1A1A1A",
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 16,
    color: "#5A6E8A",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 16,
    color: "#FF6B6B",
  },
  statusContainer: {
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 20,
    color: "#FFFFFF",
  },
  actionsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionsTitle: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 16,
    color: "#1A1A1A",
    marginBottom: 16,
  },
  actionsButtons: {
    gap: 12,
  },
  actionButton: {
    width: '100%',
  },
});

export default OrderDetailsScreen;
