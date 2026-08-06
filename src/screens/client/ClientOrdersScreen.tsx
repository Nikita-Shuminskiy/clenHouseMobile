import React from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { OrderStatus } from "@/src/modules/orders/types/orders";
import { useCustomerOrders } from "@/src/modules/customer/hooks";
import { CustomerOrderFilter } from "@/src/modules/customer/types";
import {
  CLIENT_COLORS,
  ClientScreen,
  EmptyState,
  PrimaryButton,
} from "./components/ClientUI";
import {
  getPendingPayment,
  OrderSummaryCard,
} from "./components/OrderSummaryCard";

const filters: { value: CustomerOrderFilter; label: string }[] = [
  { value: "all", label: "Все" },
  { value: OrderStatus.NEW, label: "Новые" },
  { value: "pending_payment", label: "Оплата" },
  { value: OrderStatus.IN_PROGRESS, label: "В работе" },
  { value: OrderStatus.DONE, label: "Готово" },
];

const ClientOrdersScreen = () => {
  const [filter, setFilter] = React.useState<CustomerOrderFilter>("all");
  const { data: orders, isLoading, refetch, isRefetching } = useCustomerOrders();

  const filteredOrders = React.useMemo(() => {
    const list = orders ?? [];
    if (filter === "all") return list;
    if (filter === "pending_payment") {
      return list.filter((order) => !!getPendingPayment(order));
    }
    return list.filter((order) => order.status === filter);
  }, [filter, orders]);

  return (
    <ClientScreen
      title="Заказы"
      subtitle="История, статусы и повторная оплата"
      right={
        <PrimaryButton onPress={() => router.push("/(client)/create-order" as any)}>
          Новый
        </PrimaryButton>
      }
    >
      <View style={styles.filterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filters}>
            {filters.map((item) => (
              <Pressable
                key={item.value}
                onPress={() => setFilter(item.value)}
                style={[
                  styles.filter,
                  filter === item.value && styles.filterActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === item.value && styles.filterTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={CLIENT_COLORS.primary}
          />
        }
      >
        {isLoading ? (
          <ActivityIndicator color={CLIENT_COLORS.primary} />
        ) : filteredOrders.length ? (
          filteredOrders.map((order) => (
            <OrderSummaryCard
              key={order.id}
              order={order}
              onPress={() =>
                router.push({
                  pathname: "/(client)/order-details",
                  params: { orderId: order.id },
                } as any)
              }
            />
          ))
        ) : (
          <EmptyState
            title="Нет заказов"
            text="Создайте заказ или выберите другой фильтр."
          />
        )}
      </ScrollView>
    </ClientScreen>
  );
};

const styles = StyleSheet.create({
  filterWrap: {
    paddingLeft: 18,
    paddingBottom: 8,
  },
  filters: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 20,
  },
  filter: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#FFFCF8",
    borderWidth: 1,
    borderColor: CLIENT_COLORS.line,
  },
  filterActive: {
    backgroundColor: CLIENT_COLORS.primary,
    borderColor: CLIENT_COLORS.primary,
  },
  filterText: {
    fontFamily: "Onest",
    fontWeight: "700",
    fontSize: 13,
    color: CLIENT_COLORS.muted,
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 110,
    gap: 10,
  },
});

export default ClientOrdersScreen;
