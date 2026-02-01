import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import * as Clipboard from 'expo-clipboard';
import { toast } from 'sonner-native';

import { useGetMe } from "@/src/modules/auth/hooks/useGetMe";
import { useOrder, useUpdateOrderStatus, useCancelOrder } from "@/src/modules/orders/hooks/useOrders";
import { OrderStatus, OrderResponseDto } from "@/src/modules/orders/types/orders";
import Button from "@/src/shared/components/ui-kit/button";
import useTheme from "@/src/shared/use-theme/use-theme";
import { BackArrowIcon, PhoneIcon, TelegramIcon } from "@/src/shared/components/icons";
import { formatPrice, formatDateStringFull } from "@/src/shared/utils/formatting";
import { formatOverdueTime } from "@/src/shared/utils/overdueUtils";
import { normalizeOrderId, isValidUUID } from "@/src/shared/utils/uuidValidation";

// Вспомогательные функции для определения доступных действий
const getAvailableActions = (order: OrderResponseDto, userId?: string) => {
  const actions = [];

  // Проверяем, является ли пользователь курьером для этого заказа
  const isAssignedCourier = order.currier?.id === userId;

  switch (order.status) {
    case OrderStatus.NEW:
      actions.push({ key: 'accept', label: 'Принять заказ', type: 'primary' });
      break;
    case OrderStatus.PAID:
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

const getStatusColor = (status: OrderStatus, colors: any) => {
  switch (status) {
    case OrderStatus.NEW:
      return colors.green;
    case OrderStatus.PAID:
      return colors.blue;
    case OrderStatus.ASSIGNED:
      return colors.primary500;
    case OrderStatus.IN_PROGRESS:
      return colors.accent500;
    case OrderStatus.DONE:
      return colors.grey500;
    case OrderStatus.CANCELED:
      return colors.destructive;
    default:
      return colors.grey500;
  }
};

const OrderDetailsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { orderId: rawOrderId } = useLocalSearchParams<{ orderId: string | string[] }>();
  const { data: user } = useGetMe();
  const { colors } = useTheme();

  // Нормализуем orderId (обрабатываем массив и пустые значения)
  const normalizedOrderId = normalizeOrderId(rawOrderId);
  
  // Валидируем UUID
  const isValidOrderId = normalizedOrderId ? isValidUUID(normalizedOrderId) : false;

  // Получаем конкретный заказ по ID (только если orderId валидный)
  const {
    data: order,
    isLoading,
    isError,
    error
  } = useOrder(isValidOrderId ? normalizedOrderId! : '');
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

  const handleOpenMaps = useCallback(() => {
    if (!order?.coordinates) {
      Alert.alert('Ошибка', 'Координаты не найдены');
      return;
    }

    const { lat, lon } = order.coordinates;
    const url = Platform.select({
      ios: `maps://maps.apple.com/?q=${lat},${lon}`,
      android: `geo:${lat},${lon}?q=${lat},${lon}`,
    });

    if (url) {
      Linking.openURL(url).catch(err => {
        Alert.alert('Ошибка', 'Не удалось открыть карты');
      });
    }
  }, [order]);

  const handleCopyAddress = useCallback(async () => {
    if (!order) return;

    try {
      // Формируем адрес для навигатора (только улица и номер дома)
      let navigationAddress = order.address;

      // Проверяем, есть ли номер дома в основном адресе
      const addressMatch = order.address.match(/(\d+)$/);
      const hasBuildingInAddress = addressMatch !== null;

      // Добавляем только номер дома и корпус для навигатора
      if (order.addressDetails && !hasBuildingInAddress) {
        const navigationDetails: string[] = [];

        if (order.addressDetails.building) {
          navigationDetails.push(String(order.addressDetails.building));
        }

        if (order.addressDetails.buildingBlock) {
          navigationDetails.push(`корп. ${order.addressDetails.buildingBlock}`);
        }

        if (navigationDetails.length > 0) {
          navigationAddress += ', ' + navigationDetails.join(' ');
        }
      }

      await Clipboard.setStringAsync(navigationAddress);

      toast.success('Адрес скопирован', {
        description: 'Адрес для навигатора скопирован в буфер обмена',
        duration: 2000,
      });
    } catch (error) {
      toast.error('Ошибка', {
        description: 'Не удалось скопировать адрес',
        duration: 2000,
      });
    }
  }, [order]);

  const handlePhonePress = useCallback((phone: string) => {
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
  }, []);

  const handleTelegramPress = useCallback((username: string) => {
    const telegramUrl = `https://t.me/${username}`;
    Linking.canOpenURL(telegramUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(telegramUrl);
        } else {
          Alert.alert('Ошибка', 'Не удалось открыть Telegram');
        }
      })
      .catch(() => {
        Alert.alert('Ошибка', 'Не удалось открыть Telegram');
      });
  }, []);

  // Проверяем валидность orderId
  if (!normalizedOrderId || !isValidOrderId) {
    return (
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <BackArrowIcon width={24} height={24} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Детали заказа</Text>
          </View>
          <View style={styles.backButton} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {!normalizedOrderId ? 'ID заказа не указан' : 'Неверный формат ID заказа'}
          </Text>
          <TouchableOpacity 
            style={styles.backButtonError} 
            onPress={handleGoBack}
          >
            <Text style={styles.backButtonText}>Вернуться назад</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <BackArrowIcon width={24} height={24} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Детали заказа</Text>
          </View>
          <View style={styles.backButton} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Загрузка...</Text>
        </View>
      </View>
    );
  }

  // Показываем сообщение об ошибке если заказ не найден или произошла ошибка
  if (isError || (!isLoading && !order)) {
    // Проверяем, является ли ошибка ошибкой валидации UUID
    const isValidationError = error && (
      (error as any)?.message?.includes('uuid is expected') ||
      (error as any)?.response?.data?.message?.includes('uuid is expected') ||
      (error as any)?.response?.data?.message?.includes('Validation failed')
    );

    return (
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <BackArrowIcon width={24} height={24} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Детали заказа</Text>
          </View>
          <View style={styles.backButton} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {isValidationError ? 'Неверный формат ID заказа' : 'Заказ не найден'}
          </Text>
          <TouchableOpacity 
            style={styles.backButtonError} 
            onPress={handleGoBack}
          >
            <Text style={styles.backButtonText}>Вернуться назад</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <BackArrowIcon width={24} height={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Детали заказа</Text>
        </View>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[
          styles.orderDetails,
          order.isOverdue && styles.orderDetailsOverdue
        ]}>
          <View style={styles.orderHeader}>
            <Text style={[styles.sectionTitle, { marginTop: 0 }]}>Номер заказа</Text>
            {order.isOverdue && (
              <View style={styles.overdueBadge}>
                <Text style={styles.overdueBadgeText}>Просрочено</Text>
              </View>
            )}
          </View>
          <Text style={styles.orderNumber}>#{order.id.toString().slice(-8)}</Text>

          {order.description && (
            <>
              <Text style={styles.sectionTitle}>Описание</Text>
              <Text style={styles.orderDescription}>{order.description}</Text>
            </>
          )}

          <Text style={styles.sectionTitle}>Адрес</Text>
          <Text style={styles.orderAddress}>{order.address}</Text>

          {order.addressDetails && (
            <View key={`address-details-${order.id}`} style={styles.addressDetailsContainer}>
              {order.addressDetails.building && (
                <Text key="building" style={styles.addressDetailItem}>
                  Дом: {order.addressDetails.building}
                </Text>
              )}
              {order.addressDetails.buildingBlock && (
                <Text key="buildingBlock" style={styles.addressDetailItem}>
                  Корпус: {order.addressDetails.buildingBlock}
                </Text>
              )}
              {order.addressDetails.entrance && (
                <Text key="entrance" style={styles.addressDetailItem}>
                  Подъезд: {order.addressDetails.entrance}
                </Text>
              )}
              {order.addressDetails.floor && (
                <Text key="floor" style={styles.addressDetailItem}>
                  Этаж: {order.addressDetails.floor}
                </Text>
              )}
              {order.addressDetails.apartment && (
                <Text key="apartment" style={styles.addressDetailItem}>
                  Квартира: {order.addressDetails.apartment}
                </Text>
              )}
              {order.addressDetails.domophone && (
                <Text key="domophone" style={styles.addressDetailItem}>
                  Домофон: {order.addressDetails.domophone}
                </Text>
              )}
            </View>
          )}

          <View style={styles.addressActions}>
            <Button
              type="secondary"
              onPress={handleCopyAddress}
              style={styles.addressActionButton}
            >
              Копировать адрес
            </Button>
            {order.coordinates && (
              <Button
                key="maps-button"
                type="secondary"
                onPress={handleOpenMaps}
                style={styles.addressActionButton}
              >
                Открыть в картах
              </Button>
            )}
          </View>

          <Text style={styles.sectionTitle}>Клиент</Text>
          <Text style={styles.customerName}>{order.customer.name}</Text>
          <TouchableOpacity
            onPress={() => handlePhonePress(order.customer.phone)}
            activeOpacity={0.7}
            style={styles.phoneContainer}
          >
            <PhoneIcon width={16} height={16} color={colors.primary500} />
            <Text style={[styles.customerPhone, { color: colors.primary500 }]}>{order.customer.phone}</Text>
          </TouchableOpacity>
          {order.customer.telegramUsername && (
            <TouchableOpacity
              onPress={() => handleTelegramPress(order.customer.telegramUsername!)}
              activeOpacity={0.7}
              style={styles.phoneContainer}
            >
              <TelegramIcon width={16} height={16} color={colors.primary500} />
              <Text style={[styles.customerPhone, { color: colors.primary500 }]}>
                @{order.customer.telegramUsername}
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.sectionTitle}>Сумма</Text>
          <Text style={styles.orderAmount}>{formatPrice(order.price)}</Text>

          {order.numberPackages !== undefined && order.numberPackages > 0 && (
            <View style={styles.packagesContainer}>
              <Text style={styles.sectionTitle}>Количество пакетов</Text>
              <View style={styles.packagesBadge}>
                <Text style={styles.packagesIcon}>📦</Text>
                <Text style={styles.packagesText}>
                  {order.numberPackages} {order.numberPackages === 1 ? 'пакет' : order.numberPackages < 5 ? 'пакета' : 'пакетов'}
                </Text>
              </View>
            </View>
          )}

          {order.notes && (
            <View key={`notes-${order.id}`}>
              <Text style={styles.sectionTitle}>Заметки</Text>
              <Text style={styles.orderNotes}>{order.notes}</Text>
            </View>
          )}

          {order.isOverdue && order.overdueMinutes !== undefined ? (
            <>
              <Text style={styles.sectionTitle}>Просрочено</Text>
              <Text style={styles.overdueText}>
                {formatOverdueTime(order.overdueMinutes)}
              </Text>
            </>
          ) : order.scheduledAt ? (
            <>
              <Text style={styles.sectionTitle}>Запланировано на</Text>
              <Text style={styles.scheduledAt}>
                {formatDateStringFull(order.scheduledAt)}
              </Text>
            </>
          ) : null}

          {order.isOverdue && (
            <View style={[styles.overdueContainer, { backgroundColor: colors.error || '#FFEBEE' }]}>
              <Text style={[styles.overdueLabel, { color: colors.error || '#DC2626' }]}>
                ⚠️ Заказ просрочен
              </Text>
              {order.overdueMinutes !== undefined && (
                <Text style={[styles.overdueMinutes, { color: colors.error || '#DC2626' }]}>
                  Просрочка: {order.overdueMinutes >= 60
                    ? `${Math.floor(order.overdueMinutes / 60)} ч ${order.overdueMinutes % 60} мин`
                    : `${order.overdueMinutes} мин`}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Кнопки действий с заказом */}
        {(() => {
          const availableActions = getAvailableActions(order, user?.id);
          if (availableActions.length === 0) return null;

          return (
            <View style={styles.actionsContainer} key={`actions-${order.id}`}>
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
                    style={[styles.actionButton]}
                  >
                    {action.label}
                  </Button>
                ))}
              </View>
            </View>
          );
        })()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 50,
    elevation: 6,
  },
  backButton: {
    padding: 10,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 28,
    color: "#1A1A1A",
    textAlign: "center",
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
    position: 'relative',
    overflow: 'hidden',
  },
  orderDetailsOverdue: {
    borderLeftWidth: 3,
    borderLeftColor: '#F44336',
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  overdueBadge: {
    backgroundColor: '#F44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  overdueBadgeText: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    color: '#FFFFFF',
  },
  overdueText: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#F44336',
  },
  sectionTitle: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 16,
    color: "#1A1A1A",
    marginTop: 16,
    marginBottom: 8,
  },
  orderNumber: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 16,
    color: "#1A1A1A",
    lineHeight: 24,
    marginBottom: 16,
  },
  orderDescription: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 14,
    color: "#5A6E8A",
    lineHeight: 20,
    marginBottom: 16,
  },
  orderAddress: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 14,
    color: "#5A6E8A",
    lineHeight: 20,
    marginBottom: 8,
  },
  addressDetailsContainer: {
    marginTop: 8,
    gap: 4,
  },
  addressDetailItem: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 14,
    color: "#5A6E8A",
    lineHeight: 20,
  },
  customerName: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 14,
    color: "#1A1A1A",
    lineHeight: 20,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  customerPhone: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 14,
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
  overdueContainer: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  overdueLabel: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 22,
  },
  overdueMinutes: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 14,
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
    textAlign: "center",
    marginBottom: 16,
  },
  backButtonError: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 8,
  },
  backButtonText: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
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
  addressActions: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 12,
  },
  addressActionButton: {
    width: '100%',
  },
  packagesContainer: {
    marginTop: 16,
  },
  packagesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  packagesIcon: {
    fontSize: 20,
  },
  packagesText: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: 24,
  },
});

export default OrderDetailsScreen;
