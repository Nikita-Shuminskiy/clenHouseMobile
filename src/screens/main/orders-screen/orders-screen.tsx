import React, { useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useGetMe } from "@/src/modules/auth/hooks/useGetMe";
import { useOrderByLocation, useUpdateOrderStatus, useTakeOrder, useCancelOrder } from "@/src/modules/orders/hooks/useOrders";
import { OrderStatus } from "@/src/modules/orders/types/orders";
import { useLocation } from "@/src/shared/hooks/useLocation";
import { calculateDistance } from "@/src/shared/utils/distance";

// UI Components
import { OrderSearch, OrderTabs, OrderList, OrderStatusSelect } from "./ui";
import CompleteOrderModal from "@/src/shared/components/modals/CompleteOrderModal";
import StartOrderModal from "@/src/shared/components/modals/StartOrderModal";

type OrderTabType = 'new' | 'my' | 'overdue';

const OrdersScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { data: user } = useGetMe();
  const { location, hasPermission } = useLocation();
  const hasLocation = hasPermission && location !== null;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<OrderTabType>('new');
  // По умолчанию показываем ASSIGNED и IN_PROGRESS (в работе)
  // Для этого используем undefined чтобы показать все, но можно фильтровать
  const [myOrdersStatusFilter, setMyOrdersStatusFilter] = useState<OrderStatus | undefined>(undefined);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [startModalVisible, setStartModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Для табы "Новые заказы" - загружаем только PAID заказы (NEW нельзя взять)
  const {
    data: newOrdersData,
    isLoading: isLoadingNew,
    isFetching: isFetchingNew,
    refetch: refetchNew,
    error: newOrdersError
  } = useOrderByLocation({
    status: OrderStatus.PAID,
    currierId: undefined,
  });

  // Для табы "Мои заказы" - загружаем заказы курьера
  // Если фильтр undefined, загружаем ASSIGNED и IN_PROGRESS (в работе)
  const {
    data: assignedOrdersData,
    isLoading: isLoadingAssigned,
    isFetching: isFetchingAssigned,
    refetch: refetchAssigned,
    error: assignedOrdersError
  } = useOrderByLocation({
    status: OrderStatus.ASSIGNED,
    currierId: user?.id,
  }, {
    enabled: !!user?.id && activeTab === 'my' && myOrdersStatusFilter === undefined,
  });

  const {
    data: inProgressOrdersData,
    isLoading: isLoadingInProgress,
    isFetching: isFetchingInProgress,
    refetch: refetchInProgress,
    error: inProgressOrdersError
  } = useOrderByLocation({
    status: OrderStatus.IN_PROGRESS,
    currierId: user?.id,
  }, {
    enabled: !!user?.id && activeTab === 'my' && myOrdersStatusFilter === undefined,
  });

  // Если выбран конкретный статус, загружаем его
  const {
    data: myOrdersData,
    isLoading: isLoadingMy,
    isFetching: isFetchingMy,
    refetch: refetchMy,
    error: myOrdersError
  } = useOrderByLocation({
    status: myOrdersStatusFilter,
    currierId: user?.id,
  }, {
    enabled: !!user?.id && activeTab === 'my' && myOrdersStatusFilter !== undefined,
  });

  // Для табы "Просроченные заказы" - загружаем просроченные заказы
  const {
    data: overdueOrdersData,
    isLoading: isLoadingOverdue,
    isFetching: isFetchingOverdue,
    refetch: refetchOverdue,
    error: overdueOrdersError
  } = useOrderByLocation({
    isOverdue: true,
    currierId: undefined,
  }, {
    enabled: activeTab === 'overdue', // Запрос выполняется только если активна таба "Просроченные"
  });

  // Объединяем и сортируем данные в зависимости от выбранной табы
  const ordersData = useMemo(() => {
    let data;

    if (activeTab === 'new') {
      data = newOrdersData;
    } else if (activeTab === 'overdue') {
      data = overdueOrdersData;
    } else {
      // Для "Мои заказы": если фильтр undefined, объединяем ASSIGNED и IN_PROGRESS
      if (myOrdersStatusFilter === undefined) {
        const assignedOrders = assignedOrdersData?.orders || [];
        const inProgressOrders = inProgressOrdersData?.orders || [];
        data = {
          orders: [...assignedOrders, ...inProgressOrders],
          total: (assignedOrdersData?.total || 0) + (inProgressOrdersData?.total || 0),
        };
      } else {
        data = myOrdersData;
      }
    }

    if (!data?.orders) {
      return { orders: [], total: 0 };
    }

    // Для табы "Новые заказы" - исключаем просроченные
    if (activeTab === 'new') {
      data = {
        ...data,
        orders: data.orders.filter(order => !order.isOverdue),
      };
    }

    // Вычисляем расстояния для всех заказов (если есть локация)
    const ordersWithDistance = data.orders.map(order => {
      let distance: number | null = null;

      if (hasLocation && location && order.coordinates) {
        distance = calculateDistance(
          {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          {
            latitude: order.coordinates.lat,
            longitude: order.coordinates.lon,
          }
        );
      }

      return { order, distance };
    });

    // Сортируем: просроченные вверху, затем по расстоянию (если есть), затем по времени
    const sorted = ordersWithDistance.sort((a, b) => {
      // 1. Просроченные всегда вверху
      if (a.order.isOverdue && !b.order.isOverdue) return -1;
      if (!a.order.isOverdue && b.order.isOverdue) return 1;

      // 2. Если оба просроченные, сортируем по времени просрочки (больше просрочки = выше)
      if (a.order.isOverdue && b.order.isOverdue) {
        const aMinutes = a.order.overdueMinutes || 0;
        const bMinutes = b.order.overdueMinutes || 0;
        if (aMinutes !== bMinutes) return bMinutes - aMinutes;
      }

      // 3. Если есть локация, сортируем по расстоянию (ближе = выше)
      if (hasLocation && a.distance !== null && b.distance !== null) {
        if (a.distance !== b.distance) {
          return a.distance - b.distance;
        }
      }

      // 4. По времени создания (новые сверху)
      return new Date(b.order.createdAt).getTime() - new Date(a.order.createdAt).getTime();
    });

    return {
      orders: sorted.map(item => item.order),
      total: data.total || 0,
    };
  }, [
    activeTab,
    newOrdersData,
    myOrdersData,
    assignedOrdersData,
    inProgressOrdersData,
    overdueOrdersData,
    hasLocation,
    location,
    myOrdersStatusFilter
  ]);

  const isLoading = activeTab === 'new'
    ? isLoadingNew
    : activeTab === 'overdue'
      ? isLoadingOverdue
      : myOrdersStatusFilter === undefined
        ? (isLoadingAssigned || isLoadingInProgress)
        : isLoadingMy;
  const isFetching = activeTab === 'new'
    ? isFetchingNew
    : activeTab === 'overdue'
      ? isFetchingOverdue
      : myOrdersStatusFilter === undefined
        ? (isFetchingAssigned || isFetchingInProgress)
        : isFetchingMy;
  const ordersError = activeTab === 'new'
    ? newOrdersError
    : activeTab === 'overdue'
      ? overdueOrdersError
      : myOrdersStatusFilter === undefined
        ? (assignedOrdersError || inProgressOrdersError)
        : myOrdersError;

  // Счетчики для табов
  const tabCounts = useMemo(() => {
    const myCount = myOrdersStatusFilter === undefined
      ? ((assignedOrdersData?.total || 0) + (inProgressOrdersData?.total || 0))
      : (myOrdersData?.total || 0);

    return {
      new: newOrdersData?.orders?.filter(order => !order.isOverdue).length || 0,
      my: myCount,
      overdue: overdueOrdersData?.total || 0,
    };
  }, [
    newOrdersData?.orders,
    assignedOrdersData?.total,
    inProgressOrdersData?.total,
    myOrdersData?.total,
    overdueOrdersData?.total,
    myOrdersStatusFilter
  ]);
  const updateStatusMutation = useUpdateOrderStatus();
  const takeOrderMutation = useTakeOrder();
  const cancelOrderMutation = useCancelOrder();

  const filteredOrders = React.useMemo(() => {
    if (!ordersData?.orders) return [];

    return ordersData.orders.filter(order => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      try {
        return (
          (order.description?.toLowerCase() || '').includes(query) ||
          (order.address?.toLowerCase() || '').includes(query) ||
          (order.customer?.name?.toLowerCase() || '').includes(query) ||
          (order.customer?.phone || '').includes(query) ||
          (order.id?.toLowerCase() || '').includes(query)
        );
      } catch (error) {
        console.error('Ошибка при фильтрации заказа:', error, order);
        return false;
      }
    });
  }, [ordersData?.orders, searchQuery]);

  const handleOrderAction = useCallback((order: any, action: string) => {
    switch (action) {
      case 'accept':
        if (!user?.id) {
          Alert.alert('Ошибка', 'Не удалось определить пользователя');
          return;
        }
        // Используем takeOrder для PAID заказов
        takeOrderMutation.mutate({
          id: order.id,
          data: {
            courierId: user.id
          }
        }, {
          onError: (error) => {
            console.error('Ошибка при принятии заказа:', error);
          }
        });
        break;
      case 'start':
        setSelectedOrder(order);
        setStartModalVisible(true);
        break;
      case 'complete':
        setSelectedOrder(order);
        setCompleteModalVisible(true);
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
  }, [user?.id, takeOrderMutation, updateStatusMutation, cancelOrderMutation]);

  const handleOrderPress = useCallback((order: any) => {
    router.push({
      pathname: '/(protected)/order-details' as any,
      params: { orderId: order.id }
    });
  }, []);

  const handleRefresh = useCallback(() => {
    if (activeTab === 'new') {
      refetchNew();
    } else if (activeTab === 'overdue') {
      refetchOverdue();
    } else {
      if (myOrdersStatusFilter === undefined) {
        refetchAssigned();
        refetchInProgress();
      } else {
        refetchMy();
      }
    }
  }, [activeTab, refetchNew, refetchMy, refetchOverdue, refetchAssigned, refetchInProgress, myOrdersStatusFilter]);

  const handleConfirmComplete = useCallback(() => {
    if (selectedOrder) {
      updateStatusMutation.mutate({
        id: selectedOrder.id,
        data: {
          status: OrderStatus.DONE,
          currierId: user?.id
        }
      }, {
        onSuccess: () => {
          setCompleteModalVisible(false);
          setSelectedOrder(null);
        }
      });
    }
  }, [selectedOrder, user?.id, updateStatusMutation]);

  const handleCloseCompleteModal = useCallback(() => {
    setCompleteModalVisible(false);
    setSelectedOrder(null);
  }, []);

  const handleConfirmStart = useCallback(() => {
    if (selectedOrder) {
      updateStatusMutation.mutate({
        id: selectedOrder.id,
        data: {
          status: OrderStatus.IN_PROGRESS,
          currierId: user?.id
        }
      }, {
        onSuccess: () => {
          setStartModalVisible(false);
          setSelectedOrder(null);
        }
      });
    }
  }, [selectedOrder, user?.id, updateStatusMutation]);

  const handleCloseStartModal = useCallback(() => {
    setStartModalVisible(false);
    setSelectedOrder(null);
  }, []);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Ваши заказы</Text>
      </View>

      <View style={styles.content}>
        <OrderSearch
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Поиск по описанию, адресу, клиенту..."
        />

        <OrderTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={tabCounts}
        />

        {activeTab === 'my' && (
          <OrderStatusSelect
            selectedStatus={myOrdersStatusFilter}
            onStatusChange={setMyOrdersStatusFilter}
          />
        )}

        {ordersError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Ошибка загрузки заказов. Попробуйте обновить список.
            </Text>
          </View>
        )}
        <OrderList
          orders={filteredOrders}
          isLoading={isLoading}
          isRefreshing={isFetching}
          onRefresh={handleRefresh}
          onOrderPress={handleOrderPress}
          onOrderAction={handleOrderAction}
        />
      </View>

      <CompleteOrderModal
        visible={completeModalVisible}
        onClose={handleCloseCompleteModal}
        onConfirm={handleConfirmComplete}
      />

      <StartOrderModal
        visible={startModalVisible}
        onClose={handleCloseStartModal}
        onConfirm={handleConfirmStart}
      />
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
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 50,
    elevation: 6,
  },
  title: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 28,
    color: "#1A1A1A",
  },
  content: {
    flex: 1,
    marginTop: 16,
  },
  errorContainer: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  errorText: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#F44336',
    textAlign: 'center',
  },
});

export default OrdersScreen;
