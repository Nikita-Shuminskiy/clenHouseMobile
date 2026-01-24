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
import { useOrderByLocation, useUpdateOrderStatus, useCancelOrder } from "@/src/modules/orders/hooks/useOrders";
import { OrderStatus } from "@/src/modules/orders/types/orders";

// UI Components
import { OrderSearch, OrderTabs, OrderList, OrderStatusSelect } from "./ui";
import CompleteOrderModal from "@/src/shared/components/modals/CompleteOrderModal";
import StartOrderModal from "@/src/shared/components/modals/StartOrderModal";

type OrderTabType = 'new' | 'my' | 'overdue';

const OrdersScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { data: user } = useGetMe();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<OrderTabType>('new');
  const [myOrdersStatusFilter, setMyOrdersStatusFilter] = useState<OrderStatus | undefined>(OrderStatus.IN_PROGRESS);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [startModalVisible, setStartModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Для табы "Новые заказы" - загружаем заказы со статусами NEW и PAID без currierId
  const {
    data: newOrdersData,
    isLoading: isLoadingNew,
    isFetching: isFetchingNew,
    refetch: refetchNew,
    error: newOrdersError
  } = useOrderByLocation({
    status: OrderStatus.NEW,
    currierId: undefined,
  });

  const {
    data: paidOrdersData,
    isLoading: isLoadingPaid,
    isFetching: isFetchingPaid,
    refetch: refetchPaid,
    error: paidOrdersError
  } = useOrderByLocation({
    status: OrderStatus.PAID,
    currierId: undefined,
  });

  // Для табы "Мои заказы" - загружаем заказы курьера с учетом выбранного фильтра статуса
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
    enabled: !!user?.id && activeTab === 'my', // Запрос выполняется только если есть ID пользователя и активна таба "Мои заказы"
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

  // Объединяем данные в зависимости от выбранной табы
  const ordersData = useMemo(() => {
    if (activeTab === 'new') {
      const newOrders = newOrdersData?.orders?.filter(order => order?.status === OrderStatus.PAID) || [];
      const paidOrders = paidOrdersData?.orders || [];
      return {
        orders: [...newOrders, ...paidOrders],
        total: (newOrdersData?.total || 0) + (paidOrdersData?.total || 0),
      };
    } else if (activeTab === 'overdue') {
      return overdueOrdersData;
    } else {
      return myOrdersData;
    }
  }, [activeTab, newOrdersData, paidOrdersData, myOrdersData, overdueOrdersData]);

  const isLoading = activeTab === 'new' 
    ? (isLoadingNew || isLoadingPaid) 
    : activeTab === 'overdue'
    ? isLoadingOverdue
    : isLoadingMy;
  const isFetching = activeTab === 'new' 
    ? (isFetchingNew || isFetchingPaid) 
    : activeTab === 'overdue'
    ? isFetchingOverdue
    : isFetchingMy;
  const ordersError = activeTab === 'new' 
    ? (newOrdersError || paidOrdersError) 
    : activeTab === 'overdue'
    ? overdueOrdersError
    : myOrdersError;
  const updateStatusMutation = useUpdateOrderStatus();
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
        updateStatusMutation.mutate({
          id: order.id,
          data: {
            status: OrderStatus.ASSIGNED,
            currierId: user.id
          }
        }, {
          onError: (error) => {
            console.error('Ошибка при принятии заказа:', error);
            // Ошибка уже обрабатывается в хуке useUpdateOrderStatus
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
  }, [user?.id, updateStatusMutation, cancelOrderMutation]);

  const handleOrderPress = useCallback((order: any) => {
    router.push({
      pathname: '/(protected)/order-details' as any,
      params: { orderId: order.id }
    });
  }, []);

  const handleRefresh = useCallback(() => {
    if (activeTab === 'new') {
      refetchNew();
      refetchPaid();
    } else if (activeTab === 'overdue') {
      refetchOverdue();
    } else {
      refetchMy();
    }
  }, [activeTab, refetchNew, refetchPaid, refetchMy, refetchOverdue]);

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
        {/* <OrderSearch
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Поиск по описанию, адресу, клиенту..."
        /> */}

        <OrderTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
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
