import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useCreateOrderPayment, useCustomerOrder } from "@/src/modules/customer/hooks";
import {
  Card,
  CLIENT_COLORS,
  ClientScreen,
  EmptyState,
  PrimaryButton,
  SectionTitle,
  StatusPill,
} from "./components/ClientUI";
import {
  formatDate,
  formatMoney,
  getPendingPayment,
} from "./components/OrderSummaryCard";

const ClientOrderDetailsScreen = () => {
  const params = useLocalSearchParams<{ orderId?: string }>();
  const orderId = typeof params.orderId === "string" ? params.orderId : "";
  const orderQuery = useCustomerOrder(orderId);
  const createPayment = useCreateOrderPayment();
  const order = orderQuery.data;
  const pendingPayment = order ? getPendingPayment(order) : undefined;

  const handlePay = async () => {
    if (!order) return;
    const payment = await createPayment.mutateAsync({
      orderId: order.id,
      amount: order.price,
    });
    router.push({
      pathname: "/(client)/payment",
      params: {
        paymentId: payment.paymentId,
        paymentUrl: payment.paymentUrl,
        type: "order",
        orderId: order.id,
      },
    } as any);
  };

  return (
    <ClientScreen title="Детали заказа" subtitle={orderId ? `#${orderId.slice(0, 8)}` : ""}>
      <ScrollView contentContainerStyle={styles.content}>
        {orderQuery.isLoading ? (
          <ActivityIndicator color={CLIENT_COLORS.primary} />
        ) : !order ? (
          <EmptyState title="Заказ не найден" />
        ) : (
          <>
            <Card style={styles.card}>
              <View style={styles.top}>
                <StatusPill
                  label={order.status}
                  tone={order.status === "done" || order.status === "paid" ? "success" : order.status === "canceled" ? "danger" : "warning"}
                />
                <Text style={styles.price}>{formatMoney(order.price)}</Text>
              </View>
              <Text style={styles.address}>{order.address}</Text>
              <Text style={styles.meta}>Вывоз: {formatDate(order.scheduledAt)}</Text>
              <Text style={styles.meta}>Пакетов: {order.numberPackages ?? 2}</Text>
              {order.description ? (
                <Text style={styles.description}>{order.description}</Text>
              ) : null}
            </Card>

            <Card style={styles.card}>
              <SectionTitle>Адресные детали</SectionTitle>
              <Detail label="Дом" value={order.addressDetails?.building} />
              <Detail label="Корпус" value={order.addressDetails?.buildingBlock} />
              <Detail label="Подъезд" value={order.addressDetails?.entrance} />
              <Detail label="Этаж" value={order.addressDetails?.floor} />
              <Detail label="Квартира" value={order.addressDetails?.apartment} />
              <Detail label="Домофон" value={order.addressDetails?.domophone} />
            </Card>

            <Card style={styles.card}>
              <SectionTitle>Оплата</SectionTitle>
              {order.payments?.length ? (
                order.payments.map((payment) => (
                  <View key={payment.id} style={styles.paymentRow}>
                    <View>
                      <Text style={styles.paymentMethod}>
                        {payment.method === "subscription" ? "Подписка" : "Онлайн"}
                      </Text>
                      <Text style={styles.meta}>{formatMoney(payment.amount)}</Text>
                    </View>
                    <StatusPill
                      label={payment.status}
                      tone={payment.status === "paid" ? "success" : payment.status === "failed" ? "danger" : "warning"}
                    />
                  </View>
                ))
              ) : (
                <Text style={styles.meta}>Платежей пока нет</Text>
              )}
              {pendingPayment || order.status === "new" ? (
                <PrimaryButton loading={createPayment.isPending} onPress={handlePay}>
                  Оплатить заказ
                </PrimaryButton>
              ) : null}
            </Card>
          </>
        )}
      </ScrollView>
    </ClientScreen>
  );
};

const Detail = ({ label, value }: { label: string; value?: string | number | null }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{String(value)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 110,
    gap: 14,
  },
  card: {
    gap: 12,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontFamily: "Onest",
    fontWeight: "800",
    fontSize: 20,
    color: CLIENT_COLORS.ink,
  },
  address: {
    fontFamily: "Onest",
    fontWeight: "800",
    fontSize: 18,
    lineHeight: 24,
    color: CLIENT_COLORS.ink,
  },
  meta: {
    fontFamily: "Onest",
    fontSize: 14,
    lineHeight: 20,
    color: CLIENT_COLORS.muted,
  },
  description: {
    fontFamily: "Onest",
    fontSize: 15,
    lineHeight: 22,
    color: CLIENT_COLORS.ink,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: CLIENT_COLORS.line,
    paddingBottom: 8,
  },
  detailLabel: {
    fontFamily: "Onest",
    fontSize: 14,
    color: CLIENT_COLORS.muted,
  },
  detailValue: {
    fontFamily: "Onest",
    fontWeight: "700",
    fontSize: 14,
    color: CLIENT_COLORS.ink,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  paymentMethod: {
    fontFamily: "Onest",
    fontWeight: "700",
    fontSize: 15,
    color: CLIENT_COLORS.ink,
  },
});

export default ClientOrderDetailsScreen;
