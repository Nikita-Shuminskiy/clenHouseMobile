import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useGetMe } from "@/src/modules/auth/hooks/useGetMe";
import {
  useOrders,
  useUpdateOrderStatus,
  useCancelOrder,
} from "@/src/modules/orders/hooks/useOrders";
import { OrderStatus } from "@/src/modules/orders/types/orders";

// UI Components
import { OrderSearch, OrderFilters, OrderList } from "./ui";

const OrdersScreen: React.FC = () => {
  const { data: user } = useGetMe();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    OrderStatus | undefined
  >();

  // Получаем заказы с фильтрацией
  const {
    data: ordersData,
    isLoading,
    isFetching,
    refetch,
  } = useOrders({
    status: selectedStatus,
    currierId: user?.id,
  });
  const updateStatusMutation = useUpdateOrderStatus();
  const cancelOrderMutation = useCancelOrder();

  const filteredOrders =
    ordersData?.orders?.filter((order) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        order.description.toLowerCase().includes(query) ||
        order.address.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.customer.phone.includes(query) ||
        order.id.toLowerCase().includes(query)
      );
    }) || [];

  const handleOrderAction = useCallback(
    (order: any, action: string) => {
      switch (action) {
        case "accept":
          updateStatusMutation.mutate({
            id: order.id,
            data: {
              status: OrderStatus.ASSIGNED,
              currierId: user?.id,
            },
          });
          break;
        case "start":
          updateStatusMutation.mutate({
            id: order.id,
            data: {
              status: OrderStatus.IN_PROGRESS,
              currierId: user?.id,
            },
          });
          break;
        case "complete":
          updateStatusMutation.mutate({
            id: order.id,
            data: {
              status: OrderStatus.DONE,
              currierId: user?.id,
            },
          });
          break;
        case "cancel":
          Alert.alert(
            "Отменить заказ",
            "Вы уверены, что хотите отменить этот заказ?",
            [
              { text: "Нет", style: "cancel" },
              {
                text: "Да",
                style: "destructive",
                onPress: () => {
                  cancelOrderMutation.mutate({
                    id: order.id,
                    cancelOrderDto: {
                      courierId: user?.id || "",
                      reason: "Отменен пользователем",
                    },
                  });
                },
              },
            ]
          );
          break;
      }
    },
    [user?.id, updateStatusMutation, cancelOrderMutation]
  );

  const handleOrderPress = useCallback((order: any) => {
    router.push({
      pathname: "/(protected)/order-details" as any,
      params: { orderId: order.id },
    });
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>Заказы</Text>
      </View>

      <View style={styles.content}>
        {/* <OrderSearch
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Поиск по описанию, адресу, клиенту..."
        /> */}

        <OrderFilters
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />

        <OrderList
          orders={filteredOrders}
          isLoading={isLoading}
          isRefreshing={isFetching}
          onRefresh={handleRefresh}
          onOrderPress={handleOrderPress}
          onOrderAction={handleOrderAction}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFCFE",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  userInfo: {
    flex: 1,
  },
  subtitle: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 24,
    lineHeight: 32,
    color: "#1A1A1A",
  },
  content: {
    flex: 1,
    marginTop: 16,
  },
});

export default OrdersScreen;
