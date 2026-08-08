import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { OrderResponseDto, OrderStatus } from "@/src/modules/orders/types/orders";
import { Card, CLIENT_COLORS, StatusPill } from "./ClientUI";

const statusLabels: Record<OrderStatus, string> = {
  new: "Новый",
  paid: "Оплачен",
  assigned: "Курьер назначен",
  in_progress: "В работе",
  done: "Выполнен",
  canceled: "Отменен",
};

const statusTone = (status: OrderStatus) => {
  if (status === "done" || status === "paid") return "success";
  if (status === "canceled") return "danger";
  if (status === "new") return "warning";
  return "neutral";
};

export const formatMoney = (kopecks?: number | null) =>
  `${Math.round((kopecks ?? 0) / 100).toLocaleString("ru-RU")} ₽`;

export const formatDate = (value?: string | null) => {
  if (!value) return "Без времени";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Без времени";
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getPendingPayment = (order: OrderResponseDto) =>
  order.payments?.find((payment) => payment.status === "pending");

export const OrderSummaryCard = ({
  order,
  onPress,
}: {
  order: OrderResponseDto;
  onPress?: () => void;
}) => (
  <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
    <Card style={styles.card}>
      <View style={styles.top}>
        <StatusPill
          label={statusLabels[order.status] ?? order.status}
          tone={statusTone(order.status) as any}
        />
        <Text style={styles.price}>{formatMoney(order.price)}</Text>
      </View>
      <Text style={styles.address} numberOfLines={2}>
        {order.address}
      </Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{formatDate(order.scheduledAt)}</Text>
        <Text style={styles.meta}>
          {order.numberPackages ?? 2} пак.
        </Text>
      </View>
      {getPendingPayment(order) ? (
        <Text style={styles.pending}>Ожидает оплаты</Text>
      ) : null}
    </Card>
  </Pressable>
);

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.76,
  },
  card: {
    gap: 9,
    backgroundColor: CLIENT_COLORS.warmPanel,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  price: {
    fontFamily: "Onest",
    fontWeight: "800",
    fontSize: 17,
    color: CLIENT_COLORS.primaryDark,
  },
  address: {
    fontFamily: "Onest",
    fontWeight: "700",
    fontSize: 15,
    lineHeight: 21,
    color: CLIENT_COLORS.ink,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  meta: {
    fontFamily: "Onest",
    fontSize: 13,
    lineHeight: 18,
    color: CLIENT_COLORS.muted,
  },
  pending: {
    fontFamily: "Onest",
    fontWeight: "700",
    fontSize: 13,
    color: CLIENT_COLORS.accent,
  },
});
