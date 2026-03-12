import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useGetMe } from "@/src/modules/auth/hooks/useGetMe";
import { OrderResponseDto } from "@/src/modules/orders/types/orders";
import { useOrdersScreenModel } from "./hooks/useOrdersScreenModel";
import { useOrderActions } from "./hooks/useOrderActions";
import Button from "@/src/shared/components/ui-kit/button";

// UI Components
import { OrderSearch, OrderTabs, OrderList, OrderStatusSelect } from "./ui";
import CompleteOrderModal from "@/src/shared/components/modals/CompleteOrderModal";
import StartOrderModal from "@/src/shared/components/modals/StartOrderModal";

const OrdersScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { data: user } = useGetMe();
  const {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    myOrdersStatusFilter,
    setMyOrdersStatusFilter,
    filteredOrders,
    distancesByOrderId,
    isLoading,
    isFetching,
    ordersError,
    tabCounts,
    handleRefresh,
  } = useOrdersScreenModel({ userId: user?.id });

  const {
    handleOrderAction,
    completeModalVisible,
    startModalVisible,
    handleConfirmComplete,
    handleConfirmStart,
    handleCloseCompleteModal,
    handleCloseStartModal,
  } = useOrderActions({ userId: user?.id });

  const handleOrderPress = useCallback((order: OrderResponseDto) => {
    router.push({
      pathname: "/(protected)/order-details" as any,
      params: { orderId: order.id },
    });
  }, []);

  const handleManualRefresh = useCallback(() => {
    handleRefresh();
  }, [handleRefresh]);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerSide} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Ваши заказы</Text>
        </View>
        <Button
          type="secondary"
          size="small"
          onPress={handleManualRefresh}
          disabled={isFetching}
          containerStyle={styles.headerRefreshButton}
        >
          🔄
        </Button>
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

        {activeTab === "my" && (
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
          distancesByOrderId={distancesByOrderId}
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
    justifyContent: "space-between",
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
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerSide: {
    width: 40,
    height: 40,
  },
  headerRefreshButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    paddingVertical: 0,
    paddingHorizontal: 0,
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
